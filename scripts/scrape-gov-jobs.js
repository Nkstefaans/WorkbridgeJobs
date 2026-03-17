import { storage } from "../server/storage";
import pdfParse from "pdf-parse";
import https from "https";

const PDF_URL = "https://www.gov.za/sites/default/files/PUBLIC%20SERVICE%20VACANCY%20CIRCULAR_P.pdf";

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

  const blocks = text.split(/POST \d+\/\d+/i).slice(1);

  // Optional: clear old gov jobs first (add this method to storage later if you want)
  console.log(`Found ${blocks.length} posts — seeding into Firebase...`);

  for (const block of blocks) {
    const full = `POST ${block}`;

    const title = (full.match(/:\s*([^REF\n]+)/i) || [])[1]?.trim() || "Unknown Title";
    const reference = (full.match(/REF NO:\s*([A-Z0-9\/\-]+)/i) || [])[1]?.trim() || "";
    const centre = (full.match(/CENTRE\s*:\s*([^\n]+)/i) || [])[1]?.trim() || "";
    const salaryText = (full.match(/SALARY\s*:\s*([^\n]+)/i) || [])[1]?.trim() || "";
    const province = full.toLowerCase().includes("eastern cape") ? "Eastern Cape" : "Other Province";

    const insertJob = {
      title: `${title} ${reference ? `(${reference})` : ""}`,
      company: "South African Government (Public Service)",
      location: `${centre}, ${province}`,
      description: full.substring(0, 800) + "\n\nApply via official Z83 + CV (see circular for details)",
      salary_min: salaryText ? parseInt(salaryText.replace(/[^0-9]/g, "")) || null : null,
      salary_max: null,
      job_type: "Full-time", // or "Contract" — you can make this smarter later
      skills: [],
      company_logo: "https://via.placeholder.com/60x60/0066cc/ffffff?text=GOV",
    };

    await storage.createJob(insertJob);
  }

  console.log(`✅ DONE — All government jobs seeded into Firebase! Your site will now show them.`);
}

scrapeAndSeed().catch(console.error);