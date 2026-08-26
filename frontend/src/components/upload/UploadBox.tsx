import { useRef } from "react";
import {
  UploadCloud,
  FileText,
  X,
} from "lucide-react";

import Card from "../common/Card/Card";
import Button from "../common/Button/Button";

interface UploadBoxProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

function UploadBox({
  file,
  setFile,
}: UploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      alert("Please upload only a PDF file.");
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center text-center">
        <div
          className="mb-6 rounded-2xl p-5"
          style={{
            backgroundColor: "var(--secondary)",
            color: "var(--primary)",
          }}
        >
          <UploadCloud size={36} />
        </div>

        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--text)" }}
        >
          Upload Your Resume
        </h2>

        <p
          className="mt-2 text-sm"
          style={{ color: "var(--text-light)" }}
        >
          Upload your resume in PDF format to begin AI analysis.
        </p>

        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <div
          className="mt-8 w-full rounded-2xl border-2 border-dashed p-10 transition-all duration-300"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
          }}
        >
          {!file ? (
            <>
              <FileText
                size={48}
                className="mx-auto mb-3"
                style={{ color: "var(--text-light)" }}
              />

              <p
                className="font-medium"
                style={{ color: "var(--text)" }}
              >
                Drag & Drop your PDF here
              </p>

              <p
                className="my-2 text-xs"
                style={{ color: "var(--text-light)" }}
              >
                or
              </p>

              <Button
                type="button"
                onClick={handleChooseFile}
              >
                Choose File
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <FileText
                size={52}
                className="mx-auto"
                style={{
                  color: "var(--primary)",
                }}
              />

              <div>
                <p
                  className="font-semibold"
                  style={{
                    color: "var(--text)",
                  }}
                >
                  {file.name}
                </p>

                <p
                  className="text-sm"
                  style={{
                    color: "var(--text-light)",
                  }}
                >
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  type="button"
                  onClick={handleChooseFile}
                >
                  Change File
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={removeFile}
                  leftIcon={<X size={16} />}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default UploadBox;