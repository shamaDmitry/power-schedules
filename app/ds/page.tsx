import { Heading } from "@/components/typography/Heading";
import { Button } from "@/components/ui/button";
import { ArrowBigDown, Container } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const mainColors = [
  {
    id: uuidv4(),
    name: "primary",
    label: "primary",
  },
  {
    id: uuidv4(),
    name: "primary-foreground",
    label: "primary-foreground",
  },
  {
    id: uuidv4(),
    name: "secondary",
    label: "secondary",
  },
  {
    id: uuidv4(),
    name: "secondary-foreground",
    label: "secondary-foreground",
  },
  {
    id: uuidv4(),
    name: "accent",
    label: "accent",
  },
  {
    id: uuidv4(),
    name: "accent-foreground",
    label: "accent-foreground",
  },
  {
    id: uuidv4(),
    name: "muted",
    label: "muted",
  },
  {
    id: uuidv4(),
    name: "muted-foreground",
    label: "muted-foreground",
  },
  {
    id: uuidv4(),
    name: "destructive",
    label: "destructive",
  },
  {
    id: uuidv4(),
    name: "destructive-foreground",
    label: "destructive-foreground",
  },
];

const baseColors = [
  {
    id: uuidv4(),
    name: "background",
    label: "background",
  },
  {
    id: uuidv4(),
    name: "foreground",
    label: "foreground",
  },
  {
    id: uuidv4(),
    name: "border",
    label: "border",
  },
  {
    id: uuidv4(),
    name: "ring",
    label: "ring",
  },
];

const sidebarColor = [
  {
    id: uuidv4(),
    name: "sidebar",
    label: "sidebar",
  },
  {
    id: uuidv4(),
    name: "sidebar-foreground",
    label: "sidebar-foreground",
  },
  {
    id: uuidv4(),
    name: "sidebar-primary",
    label: "sidebar-primary",
  },
  {
    id: uuidv4(),
    name: "sidebar-primary-foreground",
    label: "sidebar-primary-foreground",
  },
  {
    id: uuidv4(),
    name: "sidebar-accent",
    label: "sidebar-accent",
  },
  {
    id: uuidv4(),
    name: "sidebar-accent-foreground",
    label: "sidebar-accent-foreground",
  },
  {
    id: uuidv4(),
    name: "sidebar-border",
    label: "sidebar-border",
  },
  {
    id: uuidv4(),
    name: "sidebar-ring",
    label: "sidebar-ring",
  },
];

const chartColor = [
  {
    id: uuidv4(),
    name: "chart-1",
    label: "chart-1",
  },
  {
    id: uuidv4(),
    name: "chart-2",
    label: "chart-2",
  },
  {
    id: uuidv4(),
    name: "chart-3",
    label: "chart-3",
  },
  {
    id: uuidv4(),
    name: "chart-4",
    label: "chart-4",
  },
  {
    id: uuidv4(),
    name: "chart-5",
    label: "chart-5",
  },
];

const componentsColor = [
  {
    id: uuidv4(),
    name: "card",
    label: "card",
  },
  {
    id: uuidv4(),
    name: "card-foreground",
    label: "card-foreground",
  },
  {
    id: uuidv4(),
    name: "popover",
    label: "popover",
  },
  {
    id: uuidv4(),
    name: "popover-foreground",
    label: "popover-foreground",
  },
  {
    id: uuidv4(),
    name: "input",
    label: "input",
  },
];

interface ColorItemProps {
  item: {
    id: string;
    name: string;
    label: string;
  };
}

const ColorItem: React.FC<ColorItemProps> = ({ item }) => {
  return (
    <div
      key={item.id}
      className="flex flex-col justify-center items-center text-center *:w-full"
    >
      <div className="capitalize font-bold">{item.label}</div>

      <div
        className="p-5 flex items-center justify-center"
        style={{ backgroundColor: `var(--${item.name})` }}
      />
    </div>
  );
};

const DsPage = () => {
  return (
    <div className="p-4 max-w-7xl mx-auto grid grid-cols-2 gap-x-5">
      <div>
        <h2 className="mb-2 text-2xl font-bold">Light theme</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 w-full border light bg-background">
          <div className="flex flex-col gap-5">
            <h3>Main</h3>

            {mainColors.map((item) => {
              return <ColorItem item={item} key={item.id} />;
            })}
          </div>

          <div className="flex flex-col gap-5">
            <h3>Base</h3>

            {baseColors.map((item) => {
              return <ColorItem item={item} key={item.id} />;
            })}
          </div>

          <div className="flex flex-col gap-5">
            <h3>Chart</h3>

            {chartColor.map((item) => {
              return <ColorItem item={item} key={item.id} />;
            })}
          </div>

          <div className="flex flex-col gap-5">
            <h3>Components</h3>

            {componentsColor.map((item) => {
              return <ColorItem item={item} key={item.id} />;
            })}
          </div>

          <div className="flex flex-col gap-5">
            <h3>Sidebar</h3>

            {sidebarColor.map((item) => {
              return <ColorItem item={item} key={item.id} />;
            })}
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-2xl font-bold">Dark theme</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 w-full border dark text-foreground bg-background">
          <div className="flex flex-col gap-5">
            <h3>Main</h3>

            {mainColors.map((item) => {
              return <ColorItem item={item} key={item.id} />;
            })}
          </div>

          <div className="flex flex-col gap-5">
            <h3>Base</h3>

            {baseColors.map((item) => {
              return <ColorItem item={item} key={item.id} />;
            })}
          </div>

          <div className="flex flex-col gap-5">
            <h3>Chart</h3>

            {chartColor.map((item) => {
              return <ColorItem item={item} key={item.id} />;
            })}
          </div>

          <div className="flex flex-col gap-5">
            <h3>Components</h3>

            {componentsColor.map((item) => {
              return <ColorItem item={item} key={item.id} />;
            })}
          </div>

          <div className="flex flex-col gap-5">
            <h3>Sidebar</h3>

            {sidebarColor.map((item) => {
              return <ColorItem item={item} key={item.id} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DsPage;
