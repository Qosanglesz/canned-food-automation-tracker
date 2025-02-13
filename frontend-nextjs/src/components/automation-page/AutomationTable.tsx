"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Play, Pause, MoreHorizontal, Edit, Trash } from "lucide-react";
import { Automation } from "@/type/automation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditAutomationForm } from "./AutomationEditForm";

interface AutomationTableProps {
  automationsData: Automation[];
}

export function AutomationTable({ automationsData }: AutomationTableProps) {
  const [automations, setAutomations] = useState(automationsData);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(
    null
  );

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/automations/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete automation");
      }

      setAutomations((prev) =>
        prev.filter((automation) => automation.automation_id !== id)
      );
    } catch (error) {
      console.error("Error deleting automation:", error);
    }
  };

  const handleAutomationUpdated = (updatedAutomation: Automation) => {
    setAutomations((prev) =>
      prev.map((automation) =>
        automation.automation_id === updatedAutomation.automation_id
          ? updatedAutomation
          : automation
      )
    );
  };

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Updated Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {automations.map((automation) => (
            <TableRow key={automation.automation_id}>
              <TableCell className="font-medium">
                {automation.automation_id}
              </TableCell>
              <TableCell>{automation.name}</TableCell>
              <TableCell>{automation.description}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    automation.status === "active" ? "default" : "secondary"
                  }
                >
                  {automation.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(automation.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(automation.updated_at).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setEditingAutomation(automation)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(automation.automation_id)}
                    >
                      <Trash className="mr-2 h-4 w-4 text-red-500" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      {editingAutomation && (
        <Dialog
          open={!!editingAutomation}
          onOpenChange={() => setEditingAutomation(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Automation</DialogTitle>
            </DialogHeader>
            <EditAutomationForm
              automation={editingAutomation}
              onAutomationUpdated={handleAutomationUpdated}
              onClose={() => setEditingAutomation(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
