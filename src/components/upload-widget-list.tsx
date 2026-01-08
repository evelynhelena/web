import { Root, Scrollbar, Thumb, Viewport } from "@radix-ui/react-scroll-area";
import { useUploads } from "../store/uploads";
import { UploadWidgetUploadItem } from "./upload-widget-upload-item";

export function UploadWidgetList() {
  const uploads = useUploads((store) => store.uploads);
  const isUploadListEmpty = uploads.size === 0;

  return (
    <div className="flex flex-col gap-3 px-3">
      <span className="font-medium text-xs">
        <span className="font-medium text-xs">Uploaded files</span>{" "}
        <span className="text-zinc-400">({uploads.size})</span>
      </span>

      <Root className="overflow-hidden" type="scroll">
        <Viewport className="h-55">
          {isUploadListEmpty ? (
            <span className="text-xs text-zinc-400">No uploads added.</span>
          ) : (
            <div className="space-y-2">
              {Array.from(uploads.entries()).map(([uploadId, upload]) => {
                return (
                  <UploadWidgetUploadItem
                    key={uploadId}
                    upload={upload}
                    uploadId={uploadId}
                  />
                );
              })}
            </div>
          )}
        </Viewport>
        <Scrollbar
          className="flex touch-none select-none bg-zinc-800 p-0.5 transition-colors duration-160 ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
          orientation="vertical"
        >
          <Thumb className="relative flex-1 rounded-[10px] bg-zinc-600 before:absolute before:top-1/2 before:left-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
        </Scrollbar>
      </Root>
    </div>
  );
}
