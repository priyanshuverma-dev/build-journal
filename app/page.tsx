import { BackgroundBeams } from "@/components/background-beams";
import Navigation from "@/components/navbar";
import { features } from "@/lib/data";
import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-grid">
      <Navigation />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-8xl font-bold mb-10">
          Welcome to Build Journal
        </h1>
        <p className="text-3xl mb-8 max-w-2xl mx-auto">
          Your personal companion for documenting and managing your project
          journey.
        </p>
        <Button
          as={Link}
          variant="faded"
          color="default"
          href="/dashboard"
          size="lg"
          className="w-40 h-16"
        >
          Get Started
        </Button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold mb-8 text-center">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <Card key={idx} className="h-36">
                <CardBody>
                  <h3 className="font-bold text-xl pb-2">{feat.title}</h3>
                  <Divider />
                  <p className="text-xl">{feat.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="text-5xl font-bold mb-8 text-center">Pricing</h2>
          <p className="text-xl mt-6">
            Build Journal is <strong>free</strong> for now! You can use all its
            features at no cost.
          </p>
          <p className="text-lg">
            As we grow and add more features, we’ll introduce premium plans with
            additional benefits, but for now, enjoy full access to everything
            for free.
          </p>
        </div>
      </section>

      <section id="about" className="container mx-auto px-4 py-16">
        <h2 className="text-5xl font-bold mb-8 text-center">
          About Build Journal
        </h2>
        <p className="text-lg mt-6 text-center max-w-2xl mx-auto">
          Build Journal is a powerful tool designed to help developers document
          every step of their project journey, from the initial idea to
          completion. Whether you’re working on a small side project or a
          large-scale application, Build Journal allows you to track your
          progress, manage code snippets, and auto-generate detailed
          documentation like README files.
        </p>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-white">
            Ready to start documenting your project?
          </h2>
          <p className="text-lg mt-4 text-center max-w-2xl mx-auto">
            The platform is designed to make project management easier and more
            organized, allowing you to focus on what matters most: building
            amazing products.
          </p>
          <Button className="mt-6" color="primary">
            Join Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-6">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Build Journal. All rights
            reserved.
          </p>
        </div>
      </footer>
      <BackgroundBeams />
    </main>
  );
}
