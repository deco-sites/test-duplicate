import { useEffect } from "preact/hooks";

interface LoggerProps {
  data: unknown;
}

export default function Logger({ data }: LoggerProps) {
  useEffect(() => {
    console.log(data);
  }, []);

  return null;
}
