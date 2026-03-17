import https from "https";
import pdfParse from "pdf-parse-fork";
import { storage } from "../server/storage";

const PDF_URL = "https://www.gov.za/sites/default/files/PUBLIC%20SERVICE%20VACANCY%20CIRCULAR_P.pdf";

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function parseJobBlock(postText: string) {
  const content = postText.trim();

  const refMatch = content.match(/REF\s*NO\s*[:\-]?\s*([A-Z0-9\/\-]+)/i);
  const centreMatch = content.match(/CENTRE\s*[:\-]?\s*([^\n]+)/i);
  const salaryMatch = content.match(/SALARY\s*[:\-]?\s*([^\n]+)/i);

  const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const topLine = lines[0] ?? "";

  let title = topLine;
  if (/^POST\s+\d+\/\d+/i.test(topLine)) {
    title = topLine.replace(/^POST\s+\d+\/\d+\s*[:\-]?\s*/i, "").split(/REF\s*NO/i)[0].trim();
  }

  if (!title) {
    const fallback = content.match(/([A-Z][A-Z\s\-\/&]{4,}?)\s*REF\s*NO/i);
    title = fallback?.[1]?.trim() ?? "Unknown Title";
  }

  const lower = content.toLowerCase();
  const province =
    lower.includes("eastern cape") ? "Eastern Cape" :
    lower.includes("western cape") ? "Western Cape" :
    lower.includes("gauteng") ? "Gauteng" :
    lower.includes("kwazulu") ? "KwaZulu-Natal" :
    lower.includes("limpopo") ? "Limpopo" :
    lower.includes("mpumalanga") ? "Mpumalanga" :
    lower.includes("north west") ? "North West" :
    lower.includes("free state") ? "Free State" :
    lower.includes("northern cape") ? "Northern Cape" :
    "Unknown Province";

  const salaryText = salaryMatch?.[1]?.trim() ?? "";
  const salaryVal = salaryText ? parseInt(salaryText.replace(/[^0-9]/g, ""), 10) : NaN;

  return {
    title: normalizeWhitespace(title) || "Unknown Title",
    reference: refMatch?.[1]?.trim() ?? "",
    centre: centreMatch?.[1]?.trim() ?? "",
    province,
    salary_min: Number.isNaN(salaryVal) ? null : salaryVal,
    description: content,
  };
}

async function scrapeAndSeed() {
  console.log("📥 Fetching latest Provincial Vacancy Circular...");

  const buffer = await new Promise<Buffer>((resolve, reject) => {
    https.get(PDF_URL, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
  });

  const data = await pdfParse(buffer);
  const text = data.text;

  const postMatches = Array.from(text.matchAll(/POST\s+\d+\/\d+[\s\S]*?(?=POST\s+\d+\/\d+|$)/gi));

  if (!postMatches.length) {
    console.log("⚠️ No job blocks found in the PDF. Check source format.");
    return;
  }

  console.log(`Found ${postMatches.length} job posts — checking existing jobs before seeding...`);

  const existingJobs = await storage.getJobs();
  const existingByTitle = new Set(existingJobs.map((job) => job.title.toLowerCase()));
  const existingByRef = new Set<string>();

  existingJobs.forEach((job) => {
    const ref = (job.title.match(/\(([^)]+)\)$/) || [])[1];
    if (ref) existingByRef.add(ref.toLowerCase());
  });

  let inserted = 0;
  let skipped = 0;

  for (const match of postMatches) {
    const block = match[0];
    const parsed = parseJobBlock(block);
    const canonicalTitle = parsed.title.toLowerCase();
    const canonicalRef = parsed.reference.toLowerCase();

    if (existingByTitle.has(canonicalTitle) || (canonicalRef && existingByRef.has(canonicalRef))) {
      skipped += 1;
      console.log(`⏭ Skipped duplicate: ${parsed.title} ${parsed.reference ? `(${parsed.reference})` : ""}`);
      continue;
    }

    const insertJob = {
      title: parsed.reference ? `${parsed.title} (${parsed.reference})` : parsed.title,
      company: "South African Government (Public Service)",
      location: `${parsed.centre || "Unknown Centre"}, ${parsed.province}`,
      description: `${parsed.description.substring(0, 1600)}\n\nApply via official Z83 + CV (see circular for details)`,
      salary_min: parsed.salary_min,
      salary_max: null,
      job_type: "Government - Public Service",
      skills: [],
      company_logo: "https://via.placeholder.com/60x60/0066cc/ffffff?text=GOV",
    };

    try {
      await storage.createJob(insertJob);
      inserted += 1;
      existingByTitle.add(canonicalTitle);
      if (canonicalRef) existingByRef.add(canonicalRef);
      console.log(`✅ Inserted: ${insertJob.title}`);
    } catch (error) {
      console.error(`❌ Error inserting job ${insertJob.title}:`, error);
    }
  }

  console.log(`\n✅ Complete: ${inserted} inserted, ${skipped} skipped, ${postMatches.length} total parsed.`);
}

scrapeAndSeed().catch((error) => {
  console.error("Fatal error running scrapeAndSeed:", error);
  process.exit(1);
});