import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              Terms of Service
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using WorkbridgeJobs ("the Service"), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  WorkbridgeJobs is an online job board platform that connects job seekers with employers across 
                  South Africa. We provide services including job listings, application management, and career resources.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">3. User Accounts</h2>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Account Registration</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>You must provide accurate and complete information</li>
                    <li>You are responsible for maintaining account security</li>
                    <li>You must be at least 16 years old to use our services</li>
                    <li>One person or entity may not maintain multiple accounts</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium mt-4">Account Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Keep your login information confidential</li>
                    <li>Notify us immediately of unauthorized access</li>
                    <li>Update your information when it changes</li>
                    <li>Use the service only for lawful purposes</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">4. Acceptable Use</h2>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Permitted Uses</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Search and apply for legitimate job opportunities</li>
                    <li>Post legitimate job openings (for employers)</li>
                    <li>Network with other professionals</li>
                    <li>Access career resources and information</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium mt-4">Prohibited Uses</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Posting false, misleading, or fraudulent job listings</li>
                    <li>Harvesting or collecting user information</li>
                    <li>Spamming or sending unsolicited communications</li>
                    <li>Uploading malicious code or viruses</li>
                    <li>Discriminatory or illegal activities</li>
                    <li>Circumventing security measures</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">5. Content and Intellectual Property</h2>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Your Content</h3>
                  <p className="text-muted-foreground">
                    You retain ownership of content you submit (resumes, profiles, etc.) but grant us a license to 
                    use, display, and share this content as necessary to provide our services.
                  </p>
                  
                  <h3 className="text-lg font-medium mt-4">Our Content</h3>
                  <p className="text-muted-foreground">
                    The WorkbridgeJobs platform, including its design, functionality, and content, is protected by 
                    copyright and other intellectual property laws.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">6. Privacy and Data Protection</h2>
                <p className="text-muted-foreground">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of 
                  the Service, to understand our practices.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">7. Job Postings and Applications</h2>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">For Employers</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Job postings must be for legitimate positions</li>
                    <li>Must comply with employment laws and regulations</li>
                    <li>Cannot discriminate based on protected characteristics</li>
                    <li>Must provide accurate job descriptions and requirements</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium mt-4">For Job Seekers</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Provide truthful and accurate information</li>
                    <li>Apply only for positions you're qualified for</li>
                    <li>Respect employer application processes</li>
                    <li>Do not apply for jobs fraudulently</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">8. Fees and Payments</h2>
                <p className="text-muted-foreground">
                  Basic job search services are free for job seekers. Premium services and employer job postings may 
                  require payment. All fees are non-refundable unless otherwise stated.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">9. Disclaimers</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>We do not guarantee job placement or employment</li>
                  <li>We are not responsible for employer-candidate interactions</li>
                  <li>Job listings are provided by third parties</li>
                  <li>We do not verify all job postings or employer information</li>
                  <li>Service availability may be interrupted or limited</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">10. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  WorkbridgeJobs shall not be liable for any indirect, incidental, special, consequential, or punitive 
                  damages resulting from your use of the service.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">11. Termination</h2>
                <p className="text-muted-foreground">
                  We may terminate or suspend your account and access to the service at any time, with or without cause, 
                  with or without notice. You may also terminate your account at any time.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">12. Governing Law</h2>
                <p className="text-muted-foreground">
                  These terms shall be governed by and construed in accordance with the laws of South Africa, 
                  without regard to its conflict of law provisions.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">13. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Changes will be posted on this page with 
                  an updated revision date. Continued use of the service constitutes acceptance of modified terms.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">14. Contact Information</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">WorkbridgeJobs</p>
                  <p className="text-muted-foreground">Email: legal@workbridgejobs.com</p>
                  <p className="text-muted-foreground">Address: [Your Business Address]</p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
