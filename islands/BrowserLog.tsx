import { useEffect } from "preact/hooks";

function BrowserLog({ payload }: { payload: unknown }) {
  useEffect(() => {
    console.log(payload);
  }, [payload]);

  return null;
}

export default BrowserLog;
