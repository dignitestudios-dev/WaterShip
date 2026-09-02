"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Lock, Check, Upload as UploadIcon, X, FileText, Loader2 } from "lucide-react";
import { useProgressStore } from "@/features/questionnaire/store/progress.store";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useOnboardingProgress,
  useUploadDocument,
  useCompleteDocumentUpload,
} from "@/features/onboarding/api/onboarding.queries";
import { DocumentCategory } from "@/features/onboarding/types/onboarding.types";

const DOCUMENTS: { id: DocumentCategory; title: string }[] = [
  { id: "tax_return", title: "Most recent tax return" },
  { id: "investment_statements", title: "Investment account statements" },
  { id: "insurance_policies", title: "Insurance policies" },
  { id: "estate_trust_docs", title: "Estate/ trust documents" },
];

export default function DocumentUploadPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<DocumentCategory | null>(null);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: progressResponse } = useOnboardingProgress();
  const uploadMutation = useUploadDocument();
  const completeMutation = useCompleteDocumentUpload();

  const rawData: any = progressResponse?.data;
  const onboardingData = rawData?.onboarding || rawData;

  const isRiskAssessmentStore = useProgressStore((state) => state.isRiskAssessmentCompleted);
  const localUploadedDocuments = useProgressStore((state) => state.uploadedDocuments);
  const setDocumentUploaded = useProgressStore((state) => state.setDocumentUploaded);
  const removeDocument = useProgressStore((state) => state.removeDocument);

  const isRiskAssessmentCompleted =
    onboardingData?.riskAssessment?.status === "completed" || isRiskAssessmentStore;
  const isLocked = !isRiskAssessmentCompleted;

  // Sync backend uploaded documents with local store mapping
  const uploadedMap = useMemo(() => {
    const map: Record<string, string> = { ...localUploadedDocuments };
    const backendDocs = onboardingData?.documentUpload?.uploadedDocuments;
    if (Array.isArray(backendDocs)) {
      backendDocs.forEach((doc: any) => {
        const type = doc.type || doc.docType || doc.code || doc.id;
        const name = doc.fileName || doc.name || doc.originalName || "Uploaded Document";
        if (type) {
          map[type] = name;
        }
      });
    }
    return map;
  }, [localUploadedDocuments, onboardingData]);

  const numUploaded = DOCUMENTS.filter((doc) => !!uploadedMap[doc.id]).length;
  const isAllUploaded =
    numUploaded === DOCUMENTS.length || onboardingData?.documentUpload?.status === "completed";

  if (!mounted) {
    return <div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D]" />;
  }

  const handleDocClick = (id: DocumentCategory) => {
    setSelectedDocId(id);
    setStagedFile(null);
  };

  const selectedDoc = DOCUMENTS.find((d) => d.id === selectedDocId);
  const currentlyUploadedFilename = selectedDocId ? uploadedMap[selectedDocId] : null;
  const displayFilename = stagedFile ? stagedFile.name : currentlyUploadedFilename;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSize = 25 * 1024 * 1024; // 25 MB

      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG, PNG and PDF files are allowed.");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File size must be up to 25 MB.");
        return;
      }

      setStagedFile(file);
    }
  };

  const handleUploadSubmit = () => {
    if (!selectedDocId || !stagedFile) return;

    uploadMutation.mutate(
      {
        file: stagedFile,
        fileName: stagedFile.name,
        type: selectedDocId,
      },
      {
        onSuccess: () => {
          setDocumentUploaded(selectedDocId, stagedFile.name);
          setSelectedDocId(null);
          setStagedFile(null);
        },
      }
    );
  };

  const handleRemoveConfirm = () => {
    if (selectedDocId) {
      if (currentlyUploadedFilename) {
        removeDocument(selectedDocId);
      }
      setStagedFile(null);
      setShowRemoveDialog(false);
    }
  };

  const handleContinue = () => {
    completeMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D] relative overflow-hidden flex flex-col items-center pb-20 pt-[80px]">
      {/* Background Blobs */}
      <div className="absolute -top-[189px] left-[calc(50%-451px/2-738px)] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[170px] right-[-206px] w-[451px] h-[492px] bg-[#2186FF] opacity-45 blur-[203px] rounded-full pointer-events-none" />

      {/* Top Header / Progress */}
      <div className="w-[799px] max-w-full flex flex-col items-center mt-[50px] z-30 relative px-4">
        <button
          onClick={() => (selectedDocId ? setSelectedDocId(null) : router.back())}
          className="absolute left-[0px] md:left-[-200px] top-[0px] w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition"
        >
          <ChevronLeft className="w-4 h-4 text-white" strokeWidth={3} />
        </button>

        {!isLocked && (
          <div className="flex flex-col items-center">
            {selectedDocId ? (
              <>
                <h1 className="text-white font-semibold text-[40px] leading-[60px] tracking-[-0.025em] text-center">
                  {selectedDoc?.title}
                </h1>
                <p className="text-[#E0E0E0] font-normal text-[16px] leading-[140%] text-center mt-[10px]">
                  Encrypted upload. Only your advisor can view these.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-white font-semibold text-[40px] leading-[60px] tracking-[-0.025em] text-center">
                  Upload Your Documents
                </h1>
                <p className="text-[#E0E0E0] font-normal text-[16px] leading-[140%] text-center mt-[25px]">
                  Upload required documents to continue your onboarding process
                </p>

                {/* Progress Bar Area */}
                <div className="w-[513px] max-w-full mt-[30px] flex flex-col gap-[10px]">
                  {/* Progress Lines */}
                  <div className="flex justify-between items-center gap-[8px] w-full">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={cn(
                          "flex-1 border-[2px] rounded-full",
                          step <= numUploaded ? "border-white" : "border-[#E0E0E0] opacity-45"
                        )}
                      />
                    ))}
                  </div>

                  {/* Progress Text */}
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[#DDEBF8] font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
                      Document {numUploaded} of 4 Uploaded
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={isLocked ? "locked" : selectedDocId ? "detail" : "list"}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center justify-center z-10 px-4"
        >
          {isLocked ? (
            <div className="flex flex-col items-center justify-center mt-[100px]">
              <div className="w-[79.49px] h-[79.49px] bg-white/15 rounded-full flex items-center justify-center mb-[25px]">
                <Lock className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-white font-semibold text-[26px] leading-[39px] tracking-[-0.025em] text-center mb-[10px]">
                Finish Earlier Steps First
              </h1>
              <p className="text-[#E0E0E0] font-normal text-[14px] leading-[21px] text-center">
                This step will become available once Step 2 is completed.
              </p>
            </div>
          ) : selectedDocId ? (
            <div className="mt-[50px] w-full max-w-[487px] flex flex-col items-center gap-[15px]">
              {/* Tap to upload area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[200px] border-[2px] border-dashed border-[#5B8EDC] bg-[rgba(255,255,255,0.05)] rounded-[17px] flex flex-col items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              >
                <UploadIcon className="w-[30px] h-[30px] text-white mb-[10px]" />
                <span className="text-white font-medium text-[16px] leading-[24px]">
                  Tap to upload
                </span>
                <span className="text-[#E0E0E0] font-normal text-[12px] leading-[18px] mt-[4px]">
                  PDF , JPG , PNG , up to 25MB
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>

              {displayFilename && (
                <>
                  {/* Selected/Uploaded File Card */}
                  <div className="w-full h-[78px] bg-white rounded-[17px] flex items-center justify-between px-[22px]">
                    <div className="flex items-center gap-[12px]">
                      <div className="w-[34px] h-[34px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] rounded-[10px] flex items-center justify-center">
                        <FileText className="w-[16px] h-[16px] text-white" />
                      </div>

                      <div className="flex flex-col justify-center gap-[2px]">
                        <span className="font-medium text-[12px] leading-[18px] tracking-[-0.01em] text-[#2A2A2A]">
                          {selectedDoc?.title}
                        </span>
                        <span className="font-medium text-[10px] leading-[15px] tracking-[-0.01em] text-[#525252] max-w-[280px] truncate">
                          {displayFilename}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowRemoveDialog(true)}
                      className="w-[24px] h-[24px] rounded-full bg-[rgba(209,29,33,0.1)] flex items-center justify-center hover:bg-[rgba(209,29,33,0.2)] transition"
                    >
                      <X className="w-3.5 h-3.5 text-[#D11D21]" strokeWidth={3} />
                    </button>
                  </div>

                  {/* Upload Button when a new file is staged */}
                  {stagedFile && (
                    <button
                      onClick={handleUploadSubmit}
                      disabled={uploadMutation.isPending}
                      className="w-full h-[42px] bg-gradient-to-br from-[#2186FF] to-[#01152D] rounded-[96px] flex items-center justify-center mt-[10px] hover:opacity-90 transition shadow-lg disabled:opacity-60"
                    >
                      {uploadMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                          <span className="text-white font-medium text-[14px]">Uploading...</span>
                        </div>
                      ) : (
                        <span className="text-white font-medium text-[14px] leading-[21px] text-center">
                          Upload
                        </span>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="mt-[50px] w-full max-w-[487px] flex flex-col gap-[10px]">
              {DOCUMENTS.map((doc) => {
                const isUploaded = !!uploadedMap[doc.id];
                const filename = uploadedMap[doc.id];

                return (
                  <div
                    key={doc.id}
                    onClick={() => handleDocClick(doc.id)}
                    className="w-full h-[78px] bg-white rounded-[17px] cursor-pointer hover:shadow-lg transition flex items-center justify-between px-[22px]"
                  >
                    <div className="flex items-center gap-[12px]">
                      <div
                        className={cn(
                          "w-[34px] h-[34px] rounded-[10px] flex items-center justify-center",
                          isUploaded
                            ? "bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)]"
                            : "bg-gray-100"
                        )}
                      >
                        <FileText
                          className={cn("w-[16px] h-[16px]", isUploaded ? "text-white" : "text-gray-400")}
                        />
                      </div>

                      <div className="flex flex-col justify-center gap-[2px]">
                        <span className="font-medium text-[12px] leading-[18px] tracking-[-0.01em] text-[#2A2A2A]">
                          {doc.title}
                        </span>
                        <span className="font-medium text-[10px] leading-[15px] tracking-[-0.01em] text-[#525252] max-w-[250px] truncate">
                          {isUploaded ? filename : "Not Uploaded"}
                        </span>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "font-medium text-[12px] leading-[18px] tracking-[-0.01em]",
                        isUploaded ? "text-[#289F2C]" : "text-[#2A2A2A]"
                      )}
                    >
                      {isUploaded ? "Uploaded" : "Upload"}
                    </span>
                  </div>
                );
              })}

              {isAllUploaded && (
                <button
                  onClick={handleContinue}
                  disabled={completeMutation.isPending}
                  className="w-full mt-[30px] h-[42px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] rounded-[96px] flex items-center justify-center hover:opacity-90 transition shadow-lg disabled:opacity-60"
                >
                  {completeMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                      <span className="text-white font-medium text-[14px]">Submitting...</span>
                    </div>
                  ) : (
                    <span className="text-white font-medium text-[14px] leading-[21px] text-center">
                      Continue
                    </span>
                  )}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Remove Document Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent
          className="border-none w-[343px] h-[338px] p-0 rounded-[32px] overflow-hidden bg-transparent shadow-none"
          showCloseButton={false}
        >
          <div className="w-full h-full bg-gradient-to-b from-[#034593] to-[#01152D] shadow-[0px_4px_30px_rgba(33,134,255,0.15)] flex flex-col items-center justify-center relative p-4">
            <div className="w-[67px] h-[67px] bg-white/15 rounded-full flex items-center justify-center mb-[15px]">
              <Check className="w-[40px] h-[35px] text-white" strokeWidth={3} />
            </div>
            <h2 className="font-semibold text-[22px] leading-[22px] text-center text-white mb-[15px] max-w-[289px]">
              Remove Document?
            </h2>
            <p className="font-normal text-[13px] leading-[160%] text-center text-[#E0E0E0] mb-[30px] max-w-[280px]">
              Are you sure you want to remove this document? You&apos;ll need to upload it again to continue.
            </p>
            <div className="flex gap-[5px]">
              <button
                onClick={() => setShowRemoveDialog(false)}
                className="flex justify-center items-center w-[142px] h-[51px] bg-white/15 rounded-[73px] text-white font-medium text-[14px] hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveConfirm}
                className="flex justify-center items-center w-[142px] h-[51px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] rounded-[73px] text-white font-medium text-[14px] hover:opacity-90 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
