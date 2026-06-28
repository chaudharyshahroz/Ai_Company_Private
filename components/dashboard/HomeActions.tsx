"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ListChecks, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function HomeActions() {
  const router = useRouter();
  const toast = useToast();

  const handleQuickAssign = () => {
    router.push("/hq/tasks/new");
    toast.push({
      tone: "info",
      title: "Pick an AI employee",
      description: "Tell them what to do and they'll get to work.",
    });
  };

  return (
    <>
      <Button onClick={handleQuickAssign} size="lg">
        <Plus size={14} strokeWidth={2.2} />
        Assign New Task
        <ArrowRight size={14} />
      </Button>
      <Button asChild variant="secondary" size="lg">
        <Link href="/hq/work-inbox">
          <ListChecks size={14} />
          Review Work
        </Link>
      </Button>
      <Button asChild variant="secondary" size="lg">
        <Link href="/employees">
          <Users size={14} />
          Hire Employee
        </Link>
      </Button>
    </>
  );
}