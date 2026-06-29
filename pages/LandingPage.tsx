import { Link } from "react-router";
import { Button } from "../components/ui/button";
import {
  Shield,
  TrendingUp,
  Users,
  Award,
  Lock,
  Zap,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">d-Stokvel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signin">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              Blockchain-Powered Savings
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Join the Future of
            <br />
            Community Savings
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            d-Stokvel brings traditional savings clubs into the blockchain era
            with transparent ledgers, reputation scoring, and decentralized
            trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signin">
              <Button size="lg" className="text-lg px-8">
                Start Saving Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose d-Stokvel?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <div className="text-muted-foreground">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">250+</div>
              <div className="text-muted-foreground">Savings Groups</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">R50M+</div>
              <div className="text-muted-foreground">Total Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Built on Trust & Transparency
            </h2>
            <p className="text-muted-foreground mb-6">
              Every transaction is recorded on the blockchain. Every member's
              reputation is visible. No hidden fees, no surprises.
            </p>
            <ul className="space-y-4">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 border border-primary/30">
            <div className="bg-card rounded-lg p-6 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Your Reputation Score
                </span>
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary">780</div>
              <div className="text-sm text-muted-foreground">Gold Tier</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>On-time payments</span>
                <span className="text-primary">+10</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Perfect attendance bonus</span>
                <span className="text-primary">+50</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Group leadership</span>
                <span className="text-primary">+25</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Savings Journey?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of members already building their financial future
            with d-Stokvel.
          </p>
          <Link to="/signin">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 bg-white text-primary hover:bg-gray-100"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">d-Stokvel</h3>
              <p className="text-sm text-muted-foreground">
                Empowering communities through decentralized savings.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Security</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2026 d-Stokvel. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Transparent Ledger",
    description:
      "Every transaction is recorded on the blockchain. See who paid, who didn't, and when.",
    icon: Shield,
  },
  {
    title: "Reputation Scoring",
    description:
      "Build your credit score through reliable participation. Good behavior is rewarded.",
    icon: Award,
  },
  {
    title: "Decentralized Trust",
    description:
      "No central authority. The group decides together, governed by smart contracts.",
    icon: Lock,
  },
  {
    title: "Fast Payouts",
    description:
      "Automated smart contracts ensure you get paid on time, every time.",
    icon: Zap,
  },
  {
    title: "Group Discovery",
    description:
      "Find and join savings groups that match your financial goals and trust requirements.",
    icon: Users,
  },
  {
    title: "Wealth Building",
    description:
      "Consistent savings habits that help you reach your financial goals faster.",
    icon: TrendingUp,
  },
];

const steps = [
  {
    title: "Sign Up & Verify",
    description:
      "Create your account and establish your initial reputation score through document verification.",
  },
  {
    title: "Join or Create a Group",
    description:
      "Browse active groups or start your own. Set contribution amounts and payout schedules.",
  },
  {
    title: "Save & Earn",
    description:
      "Make regular contributions, build your reputation, and receive your payout when it's your turn.",
  },
];

const trustPoints = [
  "All transactions verified on blockchain",
  "Smart contracts automate payouts",
  "Member reputation visible to all",
  "No hidden fees or charges",
  "Withdraw anytime with group approval",
  "Secure wallet integration",
];
