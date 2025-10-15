import React, { useState } from "react";
import SubmissionModal from "./SubmissionModal";
import RejectionModal from "./RejectionModal";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";

// Type for each submission row
interface Submission {
  id: number;
  repoName: string;
  submittedBy: string;
  submittedAt: string;
  status: string;
  rejectionReason: string;
  showcaseWeek: string | null;
}

// Initial data
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

  // Pending/Approved/Rejected submissions as one list
  const pending = submissions.filter(
    sub =>
      sub.status === "pending" ||
      sub.status === "approved" ||
      sub.status === "rejected"
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Pending Submissions
      </Typography>
      <Grid container spacing={3}>
        {pending.map(sub => (
          <Grid item xs={12} md={6} key={sub.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">{sub.repoName}</Typography>
                <Typography color="text.secondary">
                  Submitted By: {sub.submittedBy}
                </Typography>
                <Typography color="text.secondary">
                  Submitted At: {sub.submittedAt}
                </Typography>
                <Typography color="primary" sx={{ mt: 1 }}>
                  {sub.status === "rejected" && sub.rejectionReason
                    ? `Rejected (${sub.rejectionReason})`
                    : sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                </Typography>
                {sub.status === "approved" && (
                  <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id={`week-select-label-${sub.id}`}>Showcase Week</InputLabel>
                      <Select
                        labelId={`week-select-label-${sub.id}`}
                        value={sub.showcaseWeek || ""}
                        label="Showcase Week"
                        onChange={e => handleSchedule(sub.id, e.target.value)}
                      >
                        <MenuItem value="">Select Week</MenuItem>
                        {weeks.map(week => (
                          <MenuItem key={week} value={week}>
                            {week}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="info"
                  startIcon={<InfoIcon />}
                  onClick={() => setSelected(sub)}
                >
                  Details
                </Button>
                {sub.status === "pending" && (
                  <>
                    <Button
                      size="small"
                      color="success"
                      variant="contained"
                      startIcon={<CheckIcon />}
                      onClick={() => handleApprove(sub.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={<CloseIcon />}
                      onClick={() => setRejectId(sub.id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Scheduled Submissions Grouped by Week */}
      <Box mt={6}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Scheduled Submissions
        </Typography>
        <Paper elevation={1} sx={{ p: 3, background: "transparent" }}>
          {weeks.map(week => {
            const scheduled = submissions.filter(sub => sub.showcaseWeek === week);
            return (
              <Box key={week} mb={3}>
                <Typography variant="h6" sx={{ mb: 1 }}>{week}</Typography>
                <Divider sx={{ mb: 1 }} />
                {scheduled.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    No submissions scheduled.
                  </Typography>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {scheduled.map(sub => (
                      <li key={sub.id}>
                        <strong>{sub.repoName}</strong> (by {sub.submittedBy}, submitted: {sub.submittedAt})
                      </li>
                    ))}
                  </ul>
                )}
              </Box>
            );
          })}
        </Paper>
      </Box>

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
    </Box>
  );
};

export default SubmissionTable;
