import { Card } from "../ui/card";
import { Check, Globe, MessageSquareText, QrCode } from "lucide-react";

export default function FeaturesSection() {
  return (
    <div className="relative py-24 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-10 blur-[100px]" />
      </div>

      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Everything you need to serve
            <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
              {" "}
              international guests
            </span>
          </h2>
          <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Perfect for restaurants and hotels in tourist areas or diverse
            communities.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border bg-white p-8 shadow-lg dark:bg-gray-800 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-violet-600/10 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative space-y-4">
                <div className="inline-flex p-3 rounded-lg bg-primary/10 dark:bg-primary/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
                <ul className="space-y-2 pt-4">
                  {feature.points.map((point, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    title: "Smart Translation",
    description:
      "Instantly translate your menu into multiple languages with perfect accuracy.",
    icon: <Globe className="w-6 h-6 text-primary" />,
    points: [
      "95+ languages supported",
      "Context-aware translations",
      "Ingredient-specific accuracy",
      "Real-time updates",
    ],
  },
  {
    title: "AI Concierge",
    description:
      "Let AI handle customer inquiries and provide personalized recommendations.",
    icon: <MessageSquareText className="w-6 h-6 text-primary" />,
    points: [
      "24/7 guest assistance",
      "Smart recommendations",
      "Dietary restrictions handling",
      "Multi-language support",
    ],
  },
  {
    title: "Digital Menu System",
    description:
      "Beautiful, mobile-friendly menus that adapt to your guest's language.",
    icon: <QrCode className="w-6 h-6 text-primary" />,
    points: [
      "Custom QR code design",
      "Mobile-optimized layout",
      "Real-time menu updates",
      "Usage analytics",
    ],
  },
];
