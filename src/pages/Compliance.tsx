"use client";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ShieldCheck, FileText, UserCheck, Lock, Mail } from "lucide-react";

function Compliance() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold" style={{ color: "#1A1A1A" }}>
              Compliance & Legal
            </h1>
          </div>

          {/* Table of Contents */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-blue-500" />
                Table of Contents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-1 text-blue-700">
                <li><a href="#introduction" className="hover:underline">Introduction</a></li>
                <li><a href="#legal" className="hover:underline">Legal Disclaimers</a></li>
                <li><a href="#regulatory" className="hover:underline">Regulatory Information</a></li>
                <li><a href="#user" className="hover:underline">User Responsibilities</a></li>
                <li><a href="#privacy" className="hover:underline">Privacy & Security</a></li>
                <li><a href="#contact" className="hover:underline">Contact</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Introduction */}
          <Card id="introduction" className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our platform is committed to maintaining the highest standards of compliance, security, and transparency. We strive to operate in accordance with applicable laws and regulations to protect our users and the integrity of our services.
              </p>
            </CardContent>
          </Card>

          {/* Legal Disclaimers */}
          <Card id="legal" className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Legal Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-1">
                <li>This platform does not provide investment, tax, or legal advice.</li>
                <li>All financial products involve risk. Please do your own research before participating.</li>
                <li>Use of this platform may be restricted in certain jurisdictions. It is your responsibility to comply with local laws.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Regulatory Information */}
          <Card id="regulatory" className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Regulatory Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-1">
                <li>We comply with applicable KYC (Know Your Customer) and AML (Anti-Money Laundering) regulations.</li>
                <li>Our services are not available in countries subject to sanctions or embargoes.</li>
                <li>For more details, see our <Link href="/terms" className="text-blue-600 underline">Terms of Service</Link>.</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card id="user" className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-500" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ensure you are eligible to use our services in your jurisdiction.</li>
                <li>Provide accurate and truthful information during onboarding and KYC processes.</li>
                <li>Report any suspicious activity to our compliance team.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card id="privacy" className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-700" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your data is handled in accordance with our <Link href="/privacy" className="text-blue-600 underline">Privacy Policy</Link>.</li>
                <li>We use industry-standard security measures to protect your information.</li>
                <li>We do not share your personal data with third parties except as required by law.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card id="contact" className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                For compliance or legal inquiries, please contact us at:{" "}
                <a href="mailto:compliance@example.com" className="text-blue-600 underline">compliance@example.com</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Compliance;