import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              Privacy Policy
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to WorkbridgeJobs ("we," "our," or "us"). This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you visit our website and use our job board services.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">2. Information We Collect</h2>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Name and contact information when you apply for jobs</li>
                    <li>Resume and cover letter content</li>
                    <li>Email address for job alerts and communications</li>
                    <li>Employment history and preferences</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium mt-4">Usage Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent on site</li>
                    <li>Search queries and filters used</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">3. How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>To provide and improve our job board services</li>
                  <li>To match you with relevant job opportunities</li>
                  <li>To send job alerts and notifications</li>
                  <li>To communicate with you about our services</li>
                  <li>To analyze site usage and improve user experience</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">4. Advertising & Third-Party Services</h2>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Google AdSense</h3>
                  <p className="text-muted-foreground">
                    We use Google AdSense to display advertisements. Google may use cookies and web beacons to serve ads 
                    based on your visits to our site and other sites on the Internet. You can opt out of personalized 
                    advertising by visiting Google's Ad Settings.
                  </p>
                  
                  <h3 className="text-lg font-medium">Analytics</h3>
                  <p className="text-muted-foreground">
                    We use Google Analytics to analyze site usage. This service may collect information such as your 
                    IP address, browser type, and pages visited. You can opt out by installing the Google Analytics 
                    opt-out browser add-on.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">5. Cookies and Tracking</h2>
                <p className="text-muted-foreground mb-3">
                  We use cookies and similar tracking technologies to enhance your experience:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>Essential Cookies:</strong> Required for site functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand site usage</li>
                  <li><strong>Advertising Cookies:</strong> Used to show relevant ads</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">6. Data Sharing</h2>
                <p className="text-muted-foreground mb-3">We may share your information with:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Employers when you apply for jobs (with your consent)</li>
                  <li>Service providers who assist with our operations</li>
                  <li>Legal authorities when required by law</li>
                  <li>Third-party advertising partners (in anonymized form)</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">7. Your Rights</h2>
                <p className="text-muted-foreground mb-3">You have the right to:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Object to processing of your data</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">8. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information against unauthorized 
                  access, alteration, disclosure, or destruction. However, no method of transmission over the Internet 
                  is 100% secure.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">9. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our services are not directed to individuals under 16. We do not knowingly collect personal 
                  information from children under 16.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">10. Changes to Privacy Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-primary mb-3">11. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">WorkbridgeJobs</p>
                  <p className="text-muted-foreground">Email: privacy@workbridgejobs.com</p>
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
