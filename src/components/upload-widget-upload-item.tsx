import { Indicator, Root } from "@radix-ui/react-progress";
import { Download, ImageUp, Link2, RefreshCcw, X } from "lucide-react";
import { motion } from "motion/react";
import { type Upload, useUploads } from "../store/uploads";
import { downloadUrl } from "../utils/download-url";
import { formatBytes } from "../utils/format-bytes";
import { limitFileName } from "../utils/limit-format";
import { Button } from "./ui/button";

interface UploadWidgetUploadItemProps {
  upload: Upload;
  uploadId: string;
}

export function UploadWidgetUploadItem({
  upload,
  uploadId,
}: UploadWidgetUploadItemProps) {
  const cancelUpload = useUploads((store) => store.cancelUpload);
  const retryUpload = useUploads((store) => store.retryUpload);

  const progress = Math.min(
    upload.compressSizeInBytes
      ? Math.round(
          (upload.uploadSizeInBytes * 100) / upload.compressSizeInBytes
        )
      : 0,
    100
  );

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="relative flex flex-col gap-3 overflow-hidden rounded-lg bg-white/2 p-3 shadow-shape-content"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-1 font-medium text-xs">
          <ImageUp className="size-3 text-zinc-300" strokeWidth={1.5} />
          <span>{limitFileName(upload.name)}</span>
        </span>

        <span className="flex items-center gap-1.5 text-xxs text-zinc-400">
          <span className="line-through">
            {formatBytes(upload.originalSizeInBytes)}
          </span>
          <div className="size-1 rounded-full bg-zinc-700" />
          <span>
            {formatBytes(upload.compressSizeInBytes ?? 0)}
            {upload.compressSizeInBytes && (
              <span className="ml-1 text-green-400">
                -
                {Math.round(
                  ((upload.originalSizeInBytes - upload.compressSizeInBytes) *
                    100) /
                    upload.originalSizeInBytes
                )}
                %
              </span>
            )}
          </span>
          <div className="size-1 rounded-full bg-zinc-700" />
          {upload.status === "success" && <span>100%</span>}
          {upload.status === "progress" && <span>{progress}%</span>}
          {upload.status === "error" && (
            <span className="text-red-400">Erro</span>
          )}
          {upload.status === "canceled" && (
            <span className="text-amber-400">canceled</span>
          )}
        </span>
      </div>

      <Root
        className="group h-1 overflow-hidden rounded-full bg-zinc-800"
        data-status={upload.status}
        value={progress}
      >
        <Indicator
          className="h-1 bg-indigo-500 transition-all group-data-[status=canceled]:bg-yellow-400 group-data-[status=error]:bg-red-400 group-data-[status=success]:bg-green-400"
          style={{
            width: upload.status === "progress" ? `${progress}%` : "100%",
          }}
        />
      </Root>

      <div className="absolute top-2 right-2 flex items-center gap-1">
        <Button
          disabled={upload.status !== "success"}
          onClick={() => {
            if (upload.remoteUrl) {
              downloadUrl(upload.remoteUrl);
            }
          }}
          size="icon-sm"
        >
          <Download className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Download compress image</span>
        </Button>
        <Button
          aria-disabled={!upload.remoteUrl}
          onClick={() =>
            upload.remoteUrl && navigator.clipboard.writeText(upload.remoteUrl)
          }
          size="icon-sm"
        >
          <Link2 className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Copy remote URL</span>
        </Button>
        <Button
          disabled={!["canceled", "error"].includes(upload.status)}
          onClick={() => retryUpload(uploadId)}
          size="icon-sm"
        >
          <RefreshCcw className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Retry upload</span>
        </Button>
        <Button
          disabled={upload.status !== "progress"}
          onClick={() => cancelUpload(uploadId)}
          size="icon-sm"
        >
          <X className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Cancel upload</span>
        </Button>
      </div>
    </motion.div>
  );
}
