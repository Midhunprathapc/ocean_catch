import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Sea Harvest Premium Seafoods',
  description: 'Terms and Conditions governing the use of Sea Harvest Premium Seafoods platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0891B2] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>

        <article className="prose prose-sm sm:prose-base prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-[#0891B2]">
          <h1>Terms &amp; Conditions</h1>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Last Updated: 24 June 2025</p>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Effective Date: 24 June 2025</p>

          <hr />

          <h2>1. Introduction &amp; Acceptance</h2>
          <p>
            These Terms &amp; Conditions (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you
            (&ldquo;User,&rdquo; &ldquo;Customer,&rdquo; or &ldquo;you&rdquo;) and <strong>Hallmark Food Products LLP</strong>,
            operating under the brand name <strong>Sea Harvest Premium Seafoods</strong> (&ldquo;Company,&rdquo;
            &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), governing your access to and use of our website,
            applications, and services (collectively, the &ldquo;Platform&rdquo;).
          </p>
          <p>
            By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these
            Terms, along with our <Link href="/privacy">Privacy Policy</Link>. If you do not agree, you must discontinue use
            immediately.
          </p>

          <h3>1.1 Eligibility</h3>
          <ul>
            <li>You must be at least <strong>18 years of age</strong> or the age of legal majority in your jurisdiction to use this Platform.</li>
            <li>If you are accessing the Platform on behalf of a business entity, you represent that you have the authority to bind such entity to these Terms.</li>
            <li>We reserve the right to refuse service to anyone for any reason at any time.</li>
          </ul>

          <hr />

          <h2>2. Nature of Service</h2>
          <p>
            Sea Harvest Premium Seafoods is a seafood commerce platform that enables customers to browse a product catalogue
            and place order enquiries. We do not process online payments. All orders placed through this Platform are
            <strong> enquiries</strong> — final pricing, availability confirmation, and payment occur via direct communication
            (phone, WhatsApp, or email) between the customer and our team.
          </p>
          <ul>
            <li>Product listings, images, descriptions, and prices are indicative and subject to change without prior notice.</li>
            <li>Placing an order does not guarantee availability or constitute a confirmed sale until explicitly acknowledged by us.</li>
            <li>Delivery areas, timelines, and minimum order requirements are communicated during order confirmation.</li>
          </ul>

          <hr />

          <h2>3. User Responsibilities &amp; Account Security</h2>
          <p>
            While the Platform does not require user account registration for placing orders, you are responsible for:
          </p>
          <ul>
            <li>Providing accurate and truthful personal information (name, phone, email) when submitting orders or contact forms.</li>
            <li>Not impersonating any person or entity or misrepresenting your affiliation with any person or entity.</li>
            <li>Maintaining the confidentiality of any communication channels used to interact with us.</li>
            <li>Ensuring that the device and network you use to access the Platform are secure and free of malicious software.</li>
          </ul>

          <hr />

          <h2>4. Acceptable Use Policy &amp; Prohibited Activities</h2>
          <p>You agree <strong>not</strong> to:</p>
          <ul>
            <li>Use the Platform for any unlawful purpose or in violation of any applicable local, state, national, or international law.</li>
            <li>Attempt to gain unauthorized access to any portion of the Platform, its servers, databases, or any connected systems.</li>
            <li>Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Platform.</li>
            <li>Use automated scripts, bots, scrapers, or crawlers to collect data from the Platform without our express written consent.</li>
            <li>Abuse, overload, or interfere with the Platform&rsquo;s rate-limiting mechanisms, APIs, or infrastructure.</li>
            <li>Submit false, fraudulent, or spam orders or contact messages.</li>
            <li>Attempt to circumvent any security features, access controls, or rate limits implemented on the Platform.</li>
            <li>Use the Platform to transmit viruses, malware, or any other harmful code.</li>
            <li>Reproduce, duplicate, sell, resell, or exploit any portion of the Platform for commercial purposes without our prior written permission.</li>
          </ul>
          <p>
            Violation of this Acceptable Use Policy may result in immediate termination of your access, legal action, and
            reporting to relevant authorities.
          </p>

          <hr />

          <h2>5. Intellectual Property Rights</h2>
          <h3>5.1 Our Property</h3>
          <p>
            All content on the Platform — including but not limited to the source code, software architecture, visual design,
            user interface, branding, logos, trademarks (&ldquo;Sea Harvest Premium Seafoods&rdquo;), product images,
            descriptions, and textual content — is the exclusive property of Hallmark Food Products LLP or its licensors,
            protected under the Copyright Act, 1957 (India), the Trade Marks Act, 1999 (India), and applicable international
            intellectual property laws.
          </p>

          <h3>5.2 Limited License</h3>
          <p>
            We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for
            personal, non-commercial purposes, strictly in accordance with these Terms.
          </p>

          <h3>5.3 User Submissions</h3>
          <p>
            By submitting any content through the Platform (contact messages, order notes), you grant us a non-exclusive,
            royalty-free right to use such content solely for the purpose of fulfilling your request and improving our services.
          </p>

          <hr />

          <h2>6. Limitation of Liability &amp; Warranty Disclaimers</h2>
          <h3>6.1 &ldquo;As-Is&rdquo; Provision</h3>
          <p>
            THE PLATFORM IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY
            KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
            PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
          </p>

          <h3>6.2 No Guarantee</h3>
          <p>We do not warrant that:</p>
          <ul>
            <li>The Platform will be uninterrupted, timely, secure, or error-free.</li>
            <li>Product information (pricing, availability, descriptions, images) is accurate, complete, or current at all times.</li>
            <li>Any defects in the Platform will be corrected.</li>
            <li>The Platform is free of viruses or other harmful components.</li>
          </ul>

          <h3>6.3 Limitation of Liability</h3>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, HALLMARK FOOD PRODUCTS LLP, ITS DIRECTORS, PARTNERS, EMPLOYEES,
            AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
            INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </p>
          <ul>
            <li>Your access to or use of (or inability to access or use) the Platform.</li>
            <li>Any conduct or content of any third party on the Platform.</li>
            <li>Unauthorized access, use, or alteration of your submissions.</li>
            <li>Any discrepancy between listed prices and final confirmed prices.</li>
          </ul>
          <p>
            Our total aggregate liability for any claims arising from or relating to these Terms or the Platform shall not
            exceed <strong>₹5,000 (INR Five Thousand)</strong> or the amount paid by you to us in the preceding 12 months,
            whichever is lower.
          </p>

          <hr />

          <h2>7. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Hallmark Food Products LLP, its partners, officers, employees,
            and agents from and against any and all claims, liabilities, damages, losses, costs, and expenses (including
            reasonable attorney fees) arising out of or related to your violation of these Terms, your use of the Platform,
            or your violation of any rights of a third party.
          </p>

          <hr />

          <h2>8. Termination</h2>
          <ul>
            <li>We may restrict, suspend, or terminate your access to the Platform at any time, without prior notice or liability, for any reason, including breach of these Terms.</li>
            <li>Upon termination, your right to use the Platform will immediately cease.</li>
            <li>Provisions that by their nature should survive termination shall survive (including Limitation of Liability, Indemnification, and Governing Law).</li>
          </ul>

          <hr />

          <h2>9. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Material changes will be communicated by updating the
            &ldquo;Last Updated&rdquo; date above. Continued use of the Platform after such changes constitutes your acceptance
            of the revised Terms. We recommend reviewing this page periodically.
          </p>

          <hr />

          <h2>10. Governing Law &amp; Dispute Resolution</h2>
          <h3>10.1 Governing Law</h3>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of <strong>India</strong>, without regard
            to conflict of law principles. The provisions of the Information Technology Act, 2000 and rules thereunder, as
            applicable, shall govern the Platform.
          </p>

          <h3>10.2 Dispute Resolution</h3>
          <ul>
            <li><strong>Amicable Resolution:</strong> The parties shall first attempt to resolve any dispute amicably through direct negotiation within 30 days of written notice.</li>
            <li><strong>Arbitration:</strong> If unresolved, disputes shall be referred to binding arbitration under the Arbitration and Conciliation Act, 1996 (India), administered by a sole arbitrator mutually appointed, with proceedings conducted in English.</li>
            <li><strong>Jurisdiction:</strong> Subject to the above, the courts of <strong>Ernakulam, Kerala, India</strong> shall have exclusive jurisdiction.</li>
          </ul>

          <hr />

          <h2>11. Severability</h2>
          <p>
            If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the
            remaining provisions shall be enforced to the fullest extent permitted by law.
          </p>

          <hr />

          <h2>12. Contact</h2>
          <p>For questions or concerns regarding these Terms, contact us at:</p>
          <ul>
            <li><strong>Entity:</strong> Hallmark Food Products LLP</li>
            <li><strong>Brand:</strong> Sea Harvest Premium Seafoods</li>
            <li><strong>Email:</strong> midhunprathap.in@gmail.com</li>
            <li><strong>Phone:</strong> +91 9656200209</li>
          </ul>
        </article>
      </div>
    </div>
  )
}
