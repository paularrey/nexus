"use client";

import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { notificationsData } from "@/lib/mock-data/notifications";

export default function NotificationsPage() {
  const [items, setItems] = useState(notificationsData);
  const unreadCount = items.filter((item) => item.unread).length;

  const markAllRead = () => {
    setItems((current) => current.map((item) => ({ ...item, unread: false })));
    toast.success("Notifications marked as read");
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Notifications"
        title="Never miss a move."
        lede="Critical alerts, delivered the moment they land."
        action={
          unreadCount > 0 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={markAllRead}
              className="shrink-0 gap-2"
            >
              <CheckCheck className="size-4" /> Mark all read
            </Button>
          ) : undefined
        }
      />

      <section className="space-y-3" aria-label="Notifications list">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`flex gap-4 rounded-2xl border p-4 transition-colors ${item.unread ? "border-primary/25 bg-card" : "border-border bg-card/70"}`}
            >
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-xl ${item.tone}`}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold">{item.title}</h2>
                  {item.unread && (
                    <span
                      className="mt-1 size-2 shrink-0 rounded-full bg-primary"
                      aria-label="Unread"
                    />
                  )}
                </div>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {item.description}
                </p>
                <time className="mt-3 block text-xs text-muted-foreground">
                  {item.timestamp}
                </time>
              </div>
            </motion.article>
          );
        })}
      </section>
    </div>
  );
}
