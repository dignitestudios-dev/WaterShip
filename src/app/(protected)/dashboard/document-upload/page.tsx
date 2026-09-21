"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Lock, Check, Upload as UploadIcon, X, FileText, Loader2 } from "lucide-react";
import { useProgressStore } from "@/features/questionnaire/store/progress.store";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  useOnboardingProgress,
  useCompleteDocumentUpload,
  useDocumentRequirements,
} from "@/features/onboarding/api/onboarding.queries";
import { uploadDocument } from "@/features/onboarding/api/onboarding.api";
import { DocumentCategory } from "@/features/onboarding/types/onboarding.types";
import { getApiErrorMessage } from "@/lib/api-response";

interface DynamicDocItem {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  required?: boolean;
  isArchived?: boolean;
}

const isDocArchived = (doc: any): boolean => {
  if (!doc) return false;
  return Boolean(
    doc.isArchived === true ||
    doc.archived === true ||
    doc.is_archived === true ||
    doc.isArchived === "true" ||
    doc.archived === "true"
  );
};

const DEFAULT_DOCUMENTS: DynamicDocItem[] = [
  { id: "tax_return", code: "tax_return", title: "Most recent tax return", description: "Upload your most recent tax return document", required: true },
  { id: "investment_statements", code: "investment_statements", title: "Investment account statements", description: "Upload your recent investment account statements", required: true },
  { id: "insurance_policies", code: "insurance_policies", title: "Insurance policies", description: "Upload active insurance policy documents", required: true },
  { id: "estate_trust_docs", code: "estate_trust_docs", title: "Estate/ trust documents", description: "Upload estate or trust documentation", required: true },
];

export default function DocumentUploadPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: progressResponse, isLoading: isLoadingProgress } = useOnboardingProgress();
  const { data: docRequirementsResponse } = useDocumentRequirements();
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

  // Answers map for conditional requirements
  const savedAnswersMap = useMemo(() => {
    const map: Record<string, any> = {};
    const savedAnswersList =
      onboardingData?.questionnaire?.answers ||
      rawData?.questionnaire?.answers ||
      [];
    if (!Array.isArray(savedAnswersList)) return map;

    const extract = (item: any) => {
      if (!item || !item.questionId) return;
      map[item.questionId] = item.value;
      if (Array.isArray(item.conditionalAnswers)) {
        item.conditionalAnswers.forEach(extract);
      }
    };

    savedAnswersList.forEach(extract);
    return map;
  }, [onboardingData, rawData]);

  // Determine dynamic documents list from API
  const documents: DynamicDocItem[] = useMemo(() => {
    const rawRequirements =
      rawData?.documentRequirements ||
      onboardingData?.documentRequirements ||
      rawData?.data?.documentRequirements ||
      docRequirementsResponse?.data ||
      (docRequirementsResponse as any)?.documentRequirements;

    if (!Array.isArray(rawRequirements) || rawRequirements.length === 0) {
      return DEFAULT_DOCUMENTS;
    }

    return rawRequirements
      .filter((doc: any) => {
        // Exclude deactivated or deleted
        if (doc.isActive === false || doc.isDeleted === true) return false;

        // Check conditional logic if present
        if (doc.isConditional && doc.triggerCondition?.questionId) {
          const answer = savedAnswersMap[doc.triggerCondition.questionId];
          const triggerVal = doc.triggerCondition.triggerValue;
          if (triggerVal !== undefined && triggerVal !== null) {
            const answerStr = String(answer ?? "").trim().toLowerCase();
            const triggerStr = String(triggerVal).trim().toLowerCase();
            if (Array.isArray(answer)) {
              return answer.some((a) => String(a).trim().toLowerCase() === triggerStr);
            }
            return answerStr === triggerStr;
          }
        }

        return true;
      })
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      .map((doc: any) => ({
        id: (doc.code || doc._id || doc.id) as string,
        code: (doc.code || doc._id || doc.id) as string,
        title: doc.title || "Document",
        description: doc.description || null,
        required: doc.required !== false,
        isArchived: isDocArchived(doc),
      }));
  }, [rawData, onboardingData, docRequirementsResponse, savedAnswersMap]);

  // Sync backend uploaded documents with local store mapping
  const uploadedMap = useMemo(() => {
    const map: Record<string, string> = { ...localUploadedDocuments };
    const backendDocs = onboardingData?.documentUpload?.uploadedDocuments;
    if (Array.isArray(backendDocs)) {
      backendDocs.forEach((doc: any) => {
        const type = doc.type || doc.docType || doc.code || doc.requirementCode || doc.id;
        const name = doc.fileName || doc.name || doc.originalName || "Uploaded Document";
        if (type) {
          map[type] = name;
        }
      });
    }
    return map;
  }, [localUploadedDocuments, onboardingData]);

  const activeDocuments = useMemo(() => documents.filter((doc) => !doc.isArchived), [documents]);

  const numUploaded = activeDocuments.filter(
    (doc) => !!(uploadedMap[doc.id] || (doc.code && uploadedMap[doc.code]))
  ).length;

  const requiredDocs = activeDocuments.filter((doc) => doc.required !== false);
  const isAllUploaded =
    (requiredDocs.length > 0
      ? requiredDocs.every((doc) => !!(uploadedMap[doc.id] || (doc.code && uploadedMap[doc.code])))
      : activeDocuments.length > 0 && numUploaded >= activeDocuments.length) ||
    onboardingData?.documentUpload?.status === "completed";

  const isAnyDocUploading = Object.values(uploadingDocs).some(Boolean);

  if (!mounted || (isLoadingProgress && documents.length === 0)) {
    return <div className="w-full min-h-screen bg-gradient-to-b from-[#034593] to-[#01152D]" />;
  }

  const handleDocClick = (id: string) => {
    const doc = documents.find((d) => d.id === id || (d.code && d.code === id));
    if (doc?.isArchived) return;
    setSelectedDocId(id);
    setStagedFile(null);
  };

  const selectedDoc = documents.find(
    (d) => d.id === selectedDocId || (d.code && d.code === selectedDocId)
  );
  const isCurrentDocUploading = !!(
    selectedDocId && (uploadingDocs[selectedDocId] || (selectedDoc?.code && uploadingDocs[selectedDoc.code]))
  );
  const currentlyUploadedFilename = selectedDocId
    ? uploadedMap[selectedDocId] || (selectedDoc?.code ? uploadedMap[selectedDoc.code] : null)
    : null;
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

  const handleUploadSubmit = async () => {
    if (!selectedDocId || !stagedFile) return;

    const docId = selectedDocId;
    const file = stagedFile;
    const fileName = stagedFile.name;

    setUploadingDocs((prev) => ({ ...prev, [docId]: true }));

    try {
      const data = await uploadDocument({
        file,
        fileName,
        type: selectedDoc?.code || docId,
      });

      setDocumentUploaded(docId, fileName);
      if (selectedDoc?.code && selectedDoc.code !== docId) {
        setDocumentUploaded(selectedDoc.code, fileName);
      }
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding", "document-requirements"] });
      toast.success(data?.message || "Document uploaded successfully");

      setSelectedDocId((current) => {
        if (current === docId) {
          setStagedFile(null);
          return null;
        }
        return current;
      });
    } catch (error: any) {
      const message = getApiErrorMessage(error, "Failed to upload document");
      toast.error(message);
    } finally {
      setUploadingDocs((prev) => {
        const next = { ...prev };
        delete next[docId];
        return next;
      });
    }
  };

  const handleRemoveConfirm = () => {
    if (selectedDocId) {
      removeDocument(selectedDocId);
      if (selectedDoc?.code) {
        removeDocument(selectedDoc.code);
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
          onClick={() => {
            if (selectedDocId) {
              setSelectedDocId(null);
              setStagedFile(null);
            } else {
              router.back();
            }
          }}
          className="absolute left-[0px] md:left-[-200px] top-[0px] w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition"
        >
          <ChevronLeft className="w-4 h-4 text-white" strokeWidth={3} />
        </button>

        {!isLocked && (
          <div className="flex flex-col items-center">
            {selectedDocId ? (
              <>
                <h1
                  className="text-white font-semibold text-[32px] md:text-[40px] leading-[1.2] tracking-[-0.025em] text-center break-words max-w-full px-4"
                  style={{ overflowWrap: "anywhere" }}
                >
                  {selectedDoc?.title}
                </h1>
                <p className="text-[#E0E0E0] font-normal text-[16px] leading-[140%] text-center mt-[10px]">
                  {selectedDoc?.description || "Encrypted upload. Only your advisor can view these."}
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
                    {activeDocuments.map((doc, idx) => (
                      <div
                        key={doc.id || idx}
                        className={cn(
                          "flex-1 border-[2px] rounded-full",
                          idx < numUploaded ? "border-white" : "border-[#E0E0E0] opacity-45"
                        )}
                      />
                    ))}
                  </div>

                  {/* Progress Text */}
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[#DDEBF8] font-medium text-[14px] leading-[21px] tracking-[-0.01em]">
                      Document {Math.min(numUploaded, activeDocuments.length)} of {activeDocuments.length} Uploaded
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
                onClick={() => {
                  if (!isCurrentDocUploading && !selectedDoc?.isArchived) fileInputRef.current?.click();
                }}
                className={cn(
                  "w-full h-[200px] border-[2px] border-dashed border-[#5B8EDC] bg-[rgba(255,255,255,0.05)] rounded-[17px] flex flex-col items-center justify-center transition-colors",
                  isCurrentDocUploading || selectedDoc?.isArchived
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer hover:bg-[rgba(255,255,255,0.1)]"
                )}
              >
                {isCurrentDocUploading ? (
                  <>
                    <Loader2 className="w-[30px] h-[30px] text-white animate-spin mb-[10px]" />
                    <span className="text-white font-medium text-[16px] leading-[24px]">
                      Uploading document...
                    </span>
                    <span className="text-[#E0E0E0] font-normal text-[12px] leading-[18px] mt-[4px]">
                      Please wait while your document is being uploaded
                    </span>
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-[30px] h-[30px] text-white mb-[10px]" />
                    <span className="text-white font-medium text-[16px] leading-[24px]">
                      Tap to upload
                    </span>
                    <span className="text-[#E0E0E0] font-normal text-[12px] leading-[18px] mt-[4px]">
                      PDF , JPG , PNG , up to 25MB
                    </span>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={isCurrentDocUploading || selectedDoc?.isArchived}
                />
              </div>

              {displayFilename && (
                <>
                  {/* Selected/Uploaded File Card */}
                  <div className="w-full min-h-[78px] py-3.5 bg-white rounded-[17px] flex items-center justify-between px-[22px] gap-3">
                    <div className="flex items-center gap-[12px] min-w-0 flex-1">
                      <div className="w-[34px] h-[34px] shrink-0 bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] rounded-[10px] flex items-center justify-center">
                        <FileText className="w-[16px] h-[16px] text-white" />
                      </div>

                      <div className="flex flex-col justify-center gap-[2px] min-w-0 flex-1">
                        <span
                          title={selectedDoc?.title}
                          className="font-medium text-[12px] leading-[18px] tracking-[-0.01em] text-[#2A2A2A] break-words line-clamp-2"
                          style={{ overflowWrap: "anywhere" }}
                        >
                          {selectedDoc?.title}
                        </span>
                        <span
                          title={displayFilename || undefined}
                          className="font-medium text-[10px] leading-[15px] tracking-[-0.01em] text-[#525252] truncate block"
                        >
                          {displayFilename}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowRemoveDialog(true)}
                      disabled={isCurrentDocUploading}
                      className="w-[24px] h-[24px] shrink-0 rounded-full bg-[rgba(209,29,33,0.1)] flex items-center justify-center hover:bg-[rgba(209,29,33,0.2)] transition disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5 text-[#D11D21]" strokeWidth={3} />
                    </button>
                  </div>

                  {/* Upload Button when a new file is staged */}
                  {stagedFile && (
                    <button
                      onClick={handleUploadSubmit}
                      disabled={isCurrentDocUploading || selectedDoc?.isArchived}
                      className="w-full h-[42px] bg-gradient-to-br from-[#2186FF] to-[#01152D] rounded-[96px] flex items-center justify-center mt-[10px] hover:opacity-90 transition shadow-lg disabled:opacity-60"
                    >
                      {isCurrentDocUploading ? (
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
              {documents.map((doc) => {
                const isUploaded = !!(uploadedMap[doc.id] || (doc.code && uploadedMap[doc.code]));
                const filename = uploadedMap[doc.id] || (doc.code ? uploadedMap[doc.code] : null);
                const isDocUploading = !!(uploadingDocs[doc.id] || (doc.code && uploadingDocs[doc.code]));
                const isArchived = !!doc.isArchived;

                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      if (!isArchived) {
                        handleDocClick(doc.id);
                      }
                    }}
                    className={cn(
                      "w-full min-h-[78px] py-3.5 bg-white rounded-[17px] transition flex items-center justify-between px-[22px] gap-3",
                      isArchived
                        ? "opacity-55 cursor-not-allowed bg-white/80 select-none shadow-none"
                        : "cursor-pointer hover:shadow-lg"
                    )}
                  >
                    <div className="flex items-center gap-[12px] min-w-0 flex-1">
                      <div
                        className={cn(
                          "w-[34px] h-[34px] shrink-0 rounded-[10px] flex items-center justify-center",
                          isArchived
                            ? "bg-gray-100 text-gray-400"
                            : isDocUploading
                              ? "bg-[#2186FF]/10 text-[#2186FF]"
                              : isUploaded
                                ? "bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.15)] text-white"
                                : "bg-gray-100 text-gray-400"
                        )}
                      >
                        {isDocUploading ? (
                          <Loader2 className="w-[18px] h-[18px] animate-spin text-[#2186FF]" />
                        ) : (
                          <FileText
                            className={cn("w-[16px] h-[16px]", !isArchived && isUploaded ? "text-white" : "text-gray-400")}
                          />
                        )}
                      </div>

                      <div className="flex flex-col justify-center gap-[2px] min-w-0 flex-1">
                        <span
                          title={doc.title}
                          className="font-medium text-[12px] leading-[18px] tracking-[-0.01em] text-[#2A2A2A] break-words line-clamp-2"
                          style={{ overflowWrap: "anywhere" }}
                        >
                          {doc.title}
                          {isArchived ? (
                            <span className="text-[10px] text-[#8E8E93] font-normal ml-1.5 shrink-0 inline-block">(Disabled)</span>
                          ) : doc.required === false ? (
                            <span className="text-[10px] text-[#71717A] font-normal ml-1.5 shrink-0 inline-block">(Optional)</span>
                          ) : null}
                        </span>
                        <span
                          title={isUploaded ? filename || undefined : isArchived ? "Archived" : doc.description || undefined}
                          className="font-medium text-[10px] leading-[15px] tracking-[-0.01em] text-[#525252] truncate block"
                        >
                          {isDocUploading
                            ? "Uploading document..."
                            : isUploaded
                              ? filename
                              : isArchived
                                ? "Archived"
                                : doc.description || "Not Uploaded"}
                        </span>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "font-medium text-[12px] leading-[18px] tracking-[-0.01em] shrink-0",
                        isArchived
                          ? "text-[#8E8E93]"
                          : isDocUploading
                            ? "text-[#2186FF] flex items-center gap-1.5"
                            : isUploaded
                              ? "text-[#289F2C]"
                              : "text-[#2A2A2A]"
                      )}
                    >
                      {isArchived ? (
                        "Disabled"
                      ) : isDocUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Uploading...
                        </>
                      ) : isUploaded ? (
                        "Uploaded"
                      ) : (
                        "Upload"
                      )}
                    </span>
                  </div>
                );
              })}

              {isAllUploaded && (
                <button
                  onClick={handleContinue}
                  disabled={completeMutation.isPending || isAnyDocUploading}
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

