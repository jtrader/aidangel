import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Props {
  courseId: string;
  videoUrl: string;
  posterUrl?: string | null;
  storedDuration?: number | null;
  onCompleted?: () => void;
  trackProgress?: boolean;
  edgeToEdge?: boolean;
}

const COMPLETION_RATIO = 0.9;
const SAVE_INTERVAL_SEC = 5;
// Allow small forward jumps (e.g. browser buffering) but block real skip-ahead.
const FORWARD_SEEK_TOLERANCE_SEC = 2;

export default function CourseVideoPlayer({ courseId, videoUrl, posterUrl, storedDuration, onCompleted, trackProgress = true, edgeToEdge }: Props) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const maxWatchedRef = useRef(0);
  const lastSavedRef = useRef(0);
  const [secondsWatched, setSecondsWatched] = useState(0);
  const [duration, setDuration] = useState<number>(storedDuration ?? 0);
  const [completed, setCompleted] = useState(false);

  // Load existing progress
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("course_video_progress")
        .select("seconds_watched,last_position_seconds,completed")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();
      if (data) {
        maxWatchedRef.current = Number(data.seconds_watched) || 0;
        lastSavedRef.current = maxWatchedRef.current;
        setSecondsWatched(maxWatchedRef.current);
        setCompleted(!!data.completed);
        if (videoRef.current && data.last_position_seconds) {
          videoRef.current.currentTime = Number(data.last_position_seconds);
        }
      }
    })();
  }, [user, courseId]);

  const save = async (force = false) => {
    if (!user || !trackProgress) return;
    const watched = maxWatchedRef.current;
    if (!force && Math.abs(watched - lastSavedRef.current) < SAVE_INTERVAL_SEC) return;
    lastSavedRef.current = watched;
    const dur = duration || videoRef.current?.duration || 0;
    const isComplete = dur > 0 && watched >= dur * COMPLETION_RATIO;
    await supabase.from("course_video_progress").upsert(
      {
        user_id: user.id,
        course_id: courseId,
        seconds_watched: watched,
        last_position_seconds: videoRef.current?.currentTime ?? 0,
        completed: isComplete,
        completed_at: isComplete ? new Date().toISOString() : null,
      },
      { onConflict: "user_id,course_id" }
    );
    if (isComplete && !completed) {
      setCompleted(true);
      onCompleted?.();
    }
  };

  useEffect(() => {
    return () => { void save(true); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    const t = v.currentTime;
    if (t > maxWatchedRef.current) {
      // Only credit watched seconds when playing forward continuously
      maxWatchedRef.current = Math.min(t, maxWatchedRef.current + 1.5);
    }
    setSecondsWatched(maxWatchedRef.current);
    void save();
  };

  const handleSeeking = () => {
    const v = videoRef.current;
    if (!v) return;
    // Block forward-skip past max watched (rewind always allowed)
    if (v.currentTime > maxWatchedRef.current + FORWARD_SEEK_TOLERANCE_SEC) {
      v.currentTime = maxWatchedRef.current;
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current?.duration && !duration) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleEnded = () => { void save(true); };

  const pct = duration > 0 ? Math.min(100, (secondsWatched / duration) * 100) : 0;
  const requiredPct = COMPLETION_RATIO * 100;

  return (
    <div className={edgeToEdge ? "" : "mb-6"}>
      <div className={`relative bg-black overflow-hidden aspect-video ${edgeToEdge ? "" : "rounded-2xl"}`}>
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl || undefined}
          controls
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          onTimeUpdate={handleTimeUpdate}
          onSeeking={handleSeeking}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPause={() => void save(true)}
          className="w-full h-full object-cover"
          preload="metadata"
        />
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="flex items-center gap-1.5 font-medium">
            {completed ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Video watched — quiz unlocked
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 text-muted-foreground" />
                Watch {Math.round(requiredPct)}% to unlock the quiz
              </>
            )}
          </span>
          <span className="text-muted-foreground tabular-nums">
            {Math.round(pct)}%
          </span>
        </div>
        <Progress value={pct} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1.5">
          You can rewind anytime, but you can't skip ahead.
        </p>
      </div>
    </div>
  );
}
