import { FolderOpen, FileText, Users, Zap } from "lucide-react";

export default function DashboardCards() {
  const cards = [
    {
      title: "Total Projects",
      value: "12",
      subtitle: "3 active this week",
      icon: FolderOpen,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    },
    {
      title: "Files Uploaded",
      value: "248",
      subtitle: "15 uploaded today",
      icon: FileText,
      iconColor: "text-green-500",
      iconBg: "bg-green-50",
    },
    {
      title: "Team Members",
      value: "8",
      subtitle: "2 joined this month",
      icon: Users,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50",
    },
    {
      title: "Active Rooms",
      value: "3",
      subtitle: "1 room in progress",
      icon: Zap,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50",
    },
  ];

  return (
    <div className="flex gap-6 p-6 bg-gray-50 h-50">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex-1 min-w-0"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
            <div className={`p-2 rounded-lg ${card.iconBg}`}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500">{card.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
