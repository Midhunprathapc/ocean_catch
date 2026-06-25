import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Sea Harvest Premium Seafoods',
  description: 'Privacy Policy detailing how Sea Harvest Premium Seafoods collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0891B2] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>

        <article className="prose prose-sm sm:prose-base prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-[#0891B2]">
          <h1>Privacy Policy</h1>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Last Updated: 24 June 2025</p>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Effective Date: 24 June 2025</p>

          <hr />

          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy (&ldquo;Policy&rdquo;) describes how <strong>Hallmark Food Products LLP</strong>, operating
            under the brand <strong>Sea Harvest Premium Seafoods</strong> (&ldquo;Company,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;), collects, uses, stores, and protects your personal data when you use
            our website and services (the &ldquo;Platform&rdquo;).
          </p>
          <p>
            This Policy is published in compliance with the <strong>Information Technology Act, 2000</strong>, the
            <strong> Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or
            Information) Rules, 2011</strong>, and the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong> of
            India. Where our Platform is accessed by users in the European Union or California, the relevant provisions of the
            <strong> GDPR</strong> and <strong>CCPA</strong> are additionally addressed.
          </p>
          <p>
            By using the Platform, you consent to the collection and use of your information as described herein. Please read
            this Policy in conjunction with our <Link href="/terms">Terms &amp; Conditions</Link>.
          </p>

          <hr />

          <h2>2. Data We Collect</h2>

          <h3>2.1 Information You Provide Directly</h3>
          <table>
            <thead>
              <tr>
                <th>Data Point</th>
                <th>Context</th>
                <th>Required?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Full Name</td>
                <td>Order form, Contact form</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Phone Number</td>
                <td>Order form (required), Contact form (optional)</td>
                <td>Conditional</td>
              </tr>
              <tr>
                <td>Email Address</td>
                <td>Order form (optional), Contact form (optional)</td>
                <td>No</td>
              </tr>
              <tr>
                <td>Message / Order Notes</td>
                <td>Order form, Contact form</td>
                <td>Conditional</td>
              </tr>
              <tr>
                <td>Preferred Contact Method</td>
                <td>Order form (Phone / WhatsApp / Email)</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Product Selections &amp; Quantities</td>
                <td>Order form</td>
                <td>Yes (for orders)</td>
              </tr>
            </tbody>
          </table>

          <h3>2.2 Information Collected Automatically</h3>
          <table>
            <thead>
              <tr>
                <th>Data Point</th>
                <th>Purpose</th>
                <th>Storage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>IP Address</td>
                <td>Rate limiting, security audit logging, fraud prevention</td>
                <td>Server-side audit logs</td>
              </tr>
              <tr>
                <td>User Agent String</td>
                <td>Security monitoring, debugging</td>
                <td>Server-side audit logs</td>
              </tr>
              <tr>
                <td>Timestamps</td>
                <td>Order tracking, audit trail</td>
                <td>Database records</td>
              </tr>
              <tr>
                <td>Page Interactions</td>
                <td>Product browsing (category filters, product views)</td>
                <td>Server logs (ISR cache)</td>
              </tr>
            </tbody>
          </table>

          <h3>2.3 What We Do NOT Collect</h3>
          <ul>
            <li><strong>No user accounts or passwords</strong> — Our Platform does not require customer registration.</li>
            <li><strong>No payment or financial data</strong> — We do not process online payments. No credit card numbers, bank details, or UPI IDs are collected through the Platform.</li>
            <li><strong>No cookies for tracking or advertising</strong> — We do not use third-party analytics (Google Analytics, Facebook Pixel) or advertising cookies.</li>
            <li><strong>No biometric data</strong> or sensitive personal data as defined under DPDPA Section 3.</li>
          </ul>

          <hr />

          <h2>3. How We Collect Data</h2>
          <ul>
            <li><strong>Direct Submission:</strong> When you voluntarily fill out and submit our Order form or Contact form.</li>
            <li><strong>Automated Server Logging:</strong> Your IP address and request metadata are logged by our server infrastructure for security, rate limiting, and operational purposes.</li>
            <li><strong>URL Parameters:</strong> Category filter selections are passed via URL query parameters for product browsing functionality.</li>
          </ul>
          <p>
            We do <strong>not</strong> use hidden trackers, pixel tags, third-party analytics SDKs, social media widgets, or
            fingerprinting techniques.
          </p>

          <hr />

          <h2>4. Purpose of Processing</h2>
          <p>We process your personal data for the following specific, lawful purposes:</p>
          <table>
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Legal Basis (DPDPA / GDPR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fulfilling order enquiries and communicating with you</td>
                <td>Consent / Contractual necessity</td>
              </tr>
              <tr>
                <td>Responding to contact form submissions</td>
                <td>Consent</td>
              </tr>
              <tr>
                <td>Rate limiting and abuse prevention</td>
                <td>Legitimate interest / Legal obligation</td>
              </tr>
              <tr>
                <td>Security audit logging (IP, user agent)</td>
                <td>Legitimate interest</td>
              </tr>
              <tr>
                <td>Internal business analytics (order volumes, popular products)</td>
                <td>Legitimate interest</td>
              </tr>
              <tr>
                <td>Legal compliance and dispute resolution</td>
                <td>Legal obligation</td>
              </tr>
            </tbody>
          </table>
          <p>We do not process your data for profiling, automated decision-making, or targeted advertising.</p>

          <hr />

          <h2>5. Third-Party Data Sharing</h2>
          <p>We share personal data only with the following categories of service providers, strictly for operational purposes:</p>

          <table>
            <thead>
              <tr>
                <th>Service Provider</th>
                <th>Purpose</th>
                <th>Data Shared</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Neon (neon.tech)</strong></td>
                <td>Database hosting (PostgreSQL)</td>
                <td>All form-submitted data (encrypted at rest and in transit)</td>
              </tr>
              <tr>
                <td><strong>Cloudinary (cloudinary.com)</strong></td>
                <td>Product image hosting</td>
                <td>Product images only — no customer personal data</td>
              </tr>
              <tr>
                <td><strong>Hosting Infrastructure</strong></td>
                <td>Application hosting and CDN</td>
                <td>IP addresses, request headers (standard HTTP logs)</td>
              </tr>
            </tbody>
          </table>

          <p><strong>We do NOT:</strong></p>
          <ul>
            <li>Sell your personal data to any third party.</li>
            <li>Share your data with advertisers or marketing platforms.</li>
            <li>Transfer your data to data brokers or aggregators.</li>
            <li>Use your contact information for unsolicited marketing without your explicit consent.</li>
          </ul>

          <h3>5.1 Cross-Border Data Transfers</h3>
          <p>
            Our database and hosting infrastructure may be located outside India (e.g., AWS regions). Where such transfers
            occur, they are protected by appropriate safeguards including encryption in transit (TLS 1.2+), encryption at rest,
            and the service provider&rsquo;s compliance with applicable data protection standards.
          </p>

          <hr />

          <h2>6. Data Retention &amp; Deletion</h2>
          <table>
            <thead>
              <tr>
                <th>Data Category</th>
                <th>Retention Period</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Order records</td>
                <td>3 years from order date (for tax/legal compliance)</td>
              </tr>
              <tr>
                <td>Contact messages</td>
                <td>1 year from submission, unless ongoing business relationship</td>
              </tr>
              <tr>
                <td>Audit logs (IP, actions)</td>
                <td>1 year, then anonymized or deleted</td>
              </tr>
              <tr>
                <td>Deleted products</td>
                <td>Soft-deleted (retained for order history integrity), purged after 1 year</td>
              </tr>
            </tbody>
          </table>

          <h3>6.1 How to Request Deletion</h3>
          <p>
            You may request deletion of your personal data at any time by contacting us at
            <strong> midhunprathap.in@gmail.com</strong> with the subject line &ldquo;Data Deletion Request.&rdquo; We will:
          </p>
          <ul>
            <li>Verify your identity using the phone number or email associated with your order/message.</li>
            <li>Process your request within <strong>30 days</strong>.</li>
            <li>Confirm deletion or inform you if certain data must be retained for legal obligations (e.g., tax records).</li>
          </ul>

          <hr />

          <h2>7. Security Measures</h2>
          <p>We implement the following technical and organizational security measures:</p>
          <ul>
            <li><strong>Encryption in Transit:</strong> All data transmitted between your browser and our servers is encrypted using TLS (HTTPS).</li>
            <li><strong>Encryption at Rest:</strong> Database hosted on Neon PostgreSQL with AES-256 encryption at rest.</li>
            <li><strong>Rate Limiting:</strong> API endpoints are rate-limited to prevent abuse (5-120 requests per window depending on endpoint sensitivity).</li>
            <li><strong>Input Validation:</strong> All user inputs are validated and sanitized using Zod schemas before processing.</li>
            <li><strong>Access Control:</strong> Administrative access is protected by secret-key authentication with constant-time comparison to prevent timing attacks.</li>
            <li><strong>Audit Logging:</strong> All administrative actions are logged with IP address and timestamp for accountability.</li>
            <li><strong>Minimal Data Collection:</strong> We follow data minimization principles — we only collect what is necessary for order fulfillment and communication.</li>
            <li><strong>No Plaintext Secrets:</strong> All server-side credentials are stored as environment variables, never in source code or client-side bundles.</li>
          </ul>
          <p>
            While we implement reasonable security practices as prescribed under the IT (Reasonable Security Practices) Rules,
            2011, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security.
          </p>

          <hr />

          <h2>8. Your Rights</h2>

          <h3>8.1 Under Indian Law (DPDPA 2023)</h3>
          <p>As a Data Principal, you have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request confirmation of whether we hold your personal data and obtain a summary.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete personal data.</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements).</li>
            <li><strong>Grievance Redressal:</strong> File a complaint with us or with the Data Protection Board of India.</li>
            <li><strong>Withdraw Consent:</strong> Withdraw your consent at any time (this does not affect the lawfulness of processing prior to withdrawal).</li>
            <li><strong>Nominate:</strong> Nominate another person to exercise your rights in case of death or incapacity.</li>
          </ul>

          <h3>8.2 Under GDPR (EU/EEA Users)</h3>
          <p>If you are located in the EU/EEA, you additionally have the right to:</p>
          <ul>
            <li><strong>Data Portability:</strong> Receive your personal data in a structured, machine-readable format.</li>
            <li><strong>Restriction of Processing:</strong> Request limitation of processing under certain circumstances.</li>
            <li><strong>Object:</strong> Object to processing based on legitimate interests.</li>
            <li><strong>Lodge a Complaint:</strong> With your local supervisory authority.</li>
          </ul>

          <h3>8.3 Under CCPA (California Residents)</h3>
          <p>If you are a California resident, you have the right to:</p>
          <ul>
            <li><strong>Know:</strong> Request disclosure of personal information collected, used, and shared.</li>
            <li><strong>Delete:</strong> Request deletion of personal information.</li>
            <li><strong>Non-Discrimination:</strong> Not receive discriminatory treatment for exercising your rights.</li>
            <li><strong>Opt-Out of Sale:</strong> We do not sell personal information. No opt-out is necessary.</li>
          </ul>

          <h3>8.4 How to Exercise Your Rights</h3>
          <p>
            To exercise any of the above rights, email us at <strong>midhunprathap.in@gmail.com</strong> with the subject
            line &ldquo;Privacy Rights Request&rdquo; and include:
          </p>
          <ul>
            <li>Your full name and contact details used on the Platform.</li>
            <li>A description of the right you wish to exercise.</li>
            <li>Any supporting information to help us locate your records.</li>
          </ul>
          <p>We will respond within <strong>30 days</strong> of receipt.</p>

          <hr />

          <h2>9. Children&rsquo;s Privacy</h2>
          <p>
            The Platform is not directed at individuals under 18 years of age. We do not knowingly collect personal data from
            children. If you believe a minor has submitted personal data through our Platform, please contact us immediately
            and we will take steps to delete such information.
          </p>

          <hr />

          <h2>10. Cookies &amp; Local Storage</h2>
          <p>
            Our Platform uses <strong>sessionStorage</strong> (browser-only, tab-scoped) exclusively for administrative session
            management. This data is automatically cleared when the browser tab is closed and is not transmitted to our servers.
          </p>
          <p>
            We do <strong>not</strong> use persistent cookies, tracking cookies, third-party cookies, or local storage for
            customer-facing functionality. No cookie consent banner is required as we do not deploy cookies for tracking or
            analytics.
          </p>

          <hr />

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.
            Changes will be posted on this page with an updated &ldquo;Last Updated&rdquo; date. Material changes will be
            communicated via a notice on our Platform. Continued use after changes constitutes acceptance.
          </p>

          <hr />

          <h2>12. Grievance Officer</h2>
          <p>
            In accordance with the Information Technology Act, 2000 and the DPDPA 2023, the Grievance Officer for this
            Platform is:
          </p>
          <ul>
            <li><strong>Name:</strong> Midhun Prathap</li>
            <li><strong>Entity:</strong> Hallmark Food Products LLP</li>
            <li><strong>Email:</strong> midhunprathap.in@gmail.com</li>
            <li><strong>Phone:</strong> +91 9656200209</li>
            <li><strong>Response Time:</strong> Within 30 days of receipt of complaint.</li>
          </ul>

          <hr />

          <h2>13. Contact</h2>
          <p>For any privacy-related questions, concerns, or requests:</p>
          <ul>
            <li><strong>Email:</strong> midhunprathap.in@gmail.com</li>
            <li><strong>Phone:</strong> +91 9656200209</li>
            <li><strong>Address:</strong> Hallmark Food Products LLP, Kerala, India</li>
          </ul>
        </article>
      </div>
    </div>
  )
}
