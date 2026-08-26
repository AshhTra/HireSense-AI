import { Upload, Bot, History } from "lucide-react";
import Button from "../common/Button/Button";
import Card from "../common/Card/Card";

function QuickActions() {
  return (
    <Card className="p-6">
      <h2
        className="mb-6 text-xl font-semibold"
        style={{ color: "var(--text)" }}
      >
        Quick Actions
      </h2>

      <div className="flex flex-col gap-4">
        <Button
          leftIcon={<Upload size={18} />}
          fullWidth
        >
          Upload Resume
        </Button>

        <Button
          variant="secondary"
          leftIcon={<Bot size={18} />}
          fullWidth
        >
          Start Interview
        </Button>

        <Button
          variant="outline"
          leftIcon={<History size={18} />}
          fullWidth
        >
          View History
        </Button>
      </div>
    </Card>
  );
}

export default QuickActions;