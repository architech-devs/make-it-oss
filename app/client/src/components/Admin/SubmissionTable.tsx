import React, { useState } from "react";
import SubmissionModal from "./SubmissionModal";
import RejectionModal from "./RejectionModal";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Info, Check, X } from "lucide-react";

interface Submission {
  id: number;
  repoName: string;
  submittedBy: string;
  submittedAt: string;
  status: string;
  rejectionReason: string;
  showcaseWeek: string | null;
}

const initialSubmissions: Submission[] = [
  {
    id: 1,
    repoName: "gaurigupta0604/make-it-oss",
    submittedBy: "gaurigupta0604",
    submittedAt: "2025-10-06",
    status: "approved",
    rejectionReason: "",
    showcaseWeek: null,
  },
  {
    id: 2,
    repoName: "johnsmith/cool-project",
    submittedBy: "johnsmith",
    submittedAt: "2025-10-05",
    status: "rejected",
    rejectionReason: "Does not meet criteria",
    showcaseWeek: null,
  },
];

const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

const SubmissionTable: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);

  function handleApprove(id: number) {
    setSubmissions(s =>
      s.map(x => x.id === id ? { ...x, status: "approved" } : x)
    );
  }
  function handleReject(id: number, reason: string) {
    setSubmissions(s =>
      s.map(x =>
        x.id === id ? { ...x, status: "rejected", rejectionReason: reason } : x
      )
    );
    setRejectId(null);
  }

  function handleSchedule(id: number, week: string) {
    setSubmissions(s =>
      s.map(x =>
        x.id === id ? { ...x, showcaseWeek: week } : x
      )
    );
  }

  const pending = submissions.filter(
    sub =>
      sub.status === "pending" ||
      sub.status === "approved" ||
      sub.status === "rejected"
  );

  return (
    <div>
      <div className="text-2xl font-semibold mb-4">Pending Submissions</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pending.map(sub => (
          <Card key={sub.id} className="shadow-lg">
            <CardContent className="pb-4 pt-6 px-6">
              <div className="text-lg font-bold mb-1">{sub.repoName}</div>
              <div className="text-muted-foreground">Submitted By: {sub.submittedBy}</div>
              <div className="text-muted-foreground mb-1">Submitted At: {sub.submittedAt}</div>
              <div className="mt-1">
                {sub.status === "rejected" && sub.rejectionReason
                  ? <span className="text-destructive">Rejected ({sub.rejectionReason})</span>
                  : <span className="text-primary">{sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}</span>
                }
              </div>
              {sub.status === "approved" && (
                <div className="mt-4">
                  <Select
                    value={sub.showcaseWeek || ""}
                    onValueChange={(val: string) => handleSchedule(sub.id, val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Week" />
                    </SelectTrigger>

                    <SelectContent>
                      {weeks.map(week => (
                      <SelectItem key={week} value={week}>{week}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>  
              )}
            </CardContent>
            <CardFooter className="gap-2 flex flex-row">
              <Button variant="outline" size="sm" onClick={() => setSelected(sub)}>
                <Info className="mr-2 h-4 w-4" />
                Details
              </Button>
              {sub.status === "pending" && (
                <>
                  <Button variant="default" size="sm" onClick={() => handleApprove(sub.id)}>
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setRejectId(sub.id)}>
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Scheduled Submissions Grouped by Week */}
      <div className="mt-10">
        <div className="text-2xl font-semibold mb-4">Scheduled Submissions</div>
        <div className="bg-muted rounded-lg p-3">
          {weeks.map(week => {
            const scheduled = submissions.filter(sub => sub.showcaseWeek === week);
            return (
              <div key={week} className="mb-4">
                <div className="text-lg font-bold mb-1">{week}</div>
                <div className="border-b mb-1" />
                {scheduled.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic">
                    No submissions scheduled.
                  </div>
                ) : (
                  <ul className="ml-4">
                    {scheduled.map(sub => (
                      <li key={sub.id}>
                        <span className="font-semibold">{sub.repoName}</span> (by {sub.submittedBy}, submitted: {sub.submittedAt})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <SubmissionModal
        isOpen={!!selected}
        submission={selected}
        onClose={() => setSelected(null)}
      />
      <RejectionModal
        isOpen={rejectId !== null}
        onClose={() => setRejectId(null)}
        onReject={reason => {
          if (rejectId !== null) handleReject(rejectId, reason);
        }}
      />
    </div>
  );
};

export default SubmissionTable;
