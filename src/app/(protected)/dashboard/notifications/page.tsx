"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, FileText, CheckCheck, Loader2, BellOff, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  useMyNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  NotificationItem,
} from "@/features/notification";

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading, isPlaceholderData } = useMyNotifications(page, limit);
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllMutation = useMarkAllNotificationsAsRead();

  // Normalize list data from various possible response formats
  const rawData = response?.data;
  const notifications: NotificationItem[] = Array.isArray(rawData)
    ? rawData
    : (rawData as any)?.notifications ||
    (rawData as any)?.docs ||
    (rawData as any)?.items ||
    [];

  const pagination = (rawData as any)?.pagination;
  const totalPages = pagination?.totalPages || Math.ceil(((rawData as any)?.total || notifications.length) / limit) || 1;
  const hasUnread = notifications.some((n) => !n.isRead);

  const handleNotificationClick = (notif: NotificationItem) => {
    if (!notif.isRead) {
      markAsReadMutation.mutate(notif._id);
    }
    const targetUrl = notif.link || notif.data?.url || notif.data?.link;
    if (targetUrl) {
      router.push(targetUrl);
    }
  };

  const handleMarkAllAsRead = () => {
    if (markAllMutation.isPending) return;
    markAllMutation.mutate();
  };

  const formatNotificationTime = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#034593] to-[#01152D]">
      {/* Background Vectors */}
      <div className="absolute left-[calc(50%-451.09px/2-738.45px)] top-[-189px] w-[451.09px] h-[492px] bg-[#2186FF] opacity-45 blur-[203.65px] pointer-events-none" />
      <div className="absolute right-[-206.09px] bottom-[-167px] w-[451.09px] h-[492px] bg-[#2186FF] opacity-45 blur-[203.65px] pointer-events-none" />

      {/* Content Container */}
      <div className="flex flex-col w-full max-w-[1440px] px-[20px] md:px-[50px] mt-[40px] z-10 relative pb-[100px]">
        {/* Back Button & Actions Row */}
        <div className="flex items-center justify-between w-full mb-[20px]">
          <div
            className="w-[30px] h-[30px] rounded-full bg-white/15 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-[18px] h-[18px] text-white" strokeWidth={2} />
          </div>

          {hasUnread && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markAllMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white transition-all disabled:opacity-50 cursor-pointer"
            >
              {markAllMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5 text-[#2186FF]" />
              )}
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-[25px] w-full mt-[10px]">
          {/* Header */}
          <div className="flex flex-col items-center gap-[10px] text-center max-w-[799px]">
            <h1 className="font-semibold text-[32px] md:text-[40px] leading-[1.2] md:leading-[60px] tracking-[-0.025em] text-white">
              Notifications
            </h1>
            <p className="font-normal text-[14px] md:text-[16px] leading-[140%] text-[#E0E0E0]">
              Stay informed about account updates, questionnaire statuses, and real-time alerts.
            </p>
          </div>

          {/* Notifications List */}
          <div className="flex flex-col gap-[10px] w-full max-w-[1340px] mt-[20px]">
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full min-h-[80px] bg-white/10 border-[0.5px] border-[#727272]/15 rounded-[17px] flex items-center justify-between px-[30px] py-[23px] animate-pulse"
                >
                  <div className="flex items-center gap-[20px] w-full">
                    <div className="w-[34px] h-[34px] rounded-[9.71px] bg-white/20 shrink-0" />
                    <div className="flex flex-col gap-[6px] w-1/2">
                      <div className="h-4 bg-white/20 rounded w-1/3" />
                      <div className="h-3 bg-white/10 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))
            ) : notifications.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/5 rounded-2xl border border-white/10 text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/60">
                  <BellOff className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-white">No notifications yet</h3>
                <p className="text-xs md:text-sm text-[#E0E0E0] max-w-sm">
                  You are all caught up! New updates, questionnaire progress, and alerts will appear here.
                </p>
              </div>
            ) : (
              // Notification items
              notifications.map((notif) => {
                const isUnread = !notif.isRead;
                const messageText = notif.description || "";

                return (
                  <div
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`w-full min-h-[80px] border-[0.5px] rounded-[17px] flex items-center justify-between px-[20px] md:px-[30px] py-[20px] transition-all cursor-pointer ${isUnread
                        ? "bg-white/20 border-[#2186FF]/50 shadow-[0_0_15px_rgba(33,134,255,0.15)] hover:bg-white/25"
                        : "bg-white/10 border-[#727272]/15 hover:bg-white/15"
                      }`}
                  >
                    <div className="flex items-center gap-[15px] md:gap-[20px] min-w-0 flex-1 pr-2">
                      {/* Icon */}
                      <div className="relative shrink-0">
                        <div className="w-[34px] h-[34px] rounded-[9.71px] bg-gradient-to-br from-[#2186FF] to-[rgba(33,134,255,0.2)] flex items-center justify-center">
                          <FileText className="w-[14px] h-[16px] text-white" fill="white" />
                        </div>
                        {isUnread && (
                          <span className="absolute -top-1 -right-1 z-20 w-3 h-3 bg-[#2186FF] rounded-full border-2 border-white shadow-sm" />
                        )}
                      </div>

                      {/* Texts */}
                      <div className="flex flex-col gap-[4px] min-w-0 flex-1">
                        <h3
                          className={`text-[14px] leading-[21px] tracking-[-0.01em] truncate ${isUnread ? "font-bold text-white" : "font-medium text-white/90"
                            }`}
                        >
                          {notif.title}
                        </h3>
                        {messageText && (
                          <p className="font-normal text-[12px] leading-[18px]  text-[#E0E0E0] ">
                            {messageText}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Time & Read status */}
                    <div className="flex flex-col items-end shrink-0 pl-2 gap-1">
                      <span className="font-medium text-[10px] leading-[15px] tracking-[-0.01em] text-[#E0E0E0] text-right whitespace-nowrap">
                        {formatNotificationTime(notif.createdAt)}
                      </span>
                      {isUnread && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#2186FF]/30 text-[#90caf9] font-medium">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1 || isLoading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs text-white transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <span className="text-xs text-white/80">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                disabled={page >= totalPages || isLoading || isPlaceholderData}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs text-white transition-all cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
