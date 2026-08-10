import { useMemo, useState } from "react";
import styles from "./DevTools.module.css";
import * as payloadModule from "../../services/bluetooth/payloads";
import type {
  Payload,
  ComputeValuePayload,
} from "../../services/bluetooth/payloads/types";
import { parseBytes, toHexPreview, type ByteFormat } from "./parseBytes";

type SendResult = { ok: boolean; error?: Error };

type DevToolsProps = {
  isConnected: boolean;
  isSending: boolean;
  onSend: (
    bytesList: (number[] | Uint8Array | undefined)[],
  ) => Promise<SendResult>;
};

type Status = { text: string; isError: boolean };

const EXAMPLES: Record<string, object> = {
  set_alarm: { time: "07:30", repeat: false },
  set_move_nudge: {
    startTime: "09:00",
    endTime: "17:00",
    interval: 60,
    isEnabled: true,
  },
  set_daily_activity_points_goal: { points: 8000 },
  set_current_time: {},
};

const PLACEHOLDERS: Record<ByteFormat, string> = {
  hex: "01 FF A0   ·   0x01, 0xFF   ·   01ffa0",
  decimal: "1, 255, 160",
};

const getExampleJson = (id: string) =>
  JSON.stringify(EXAMPLES[id] || {}, null, 2);

const isComputePayload = (payload: Payload): payload is ComputeValuePayload => {
  return (
    "computeValue" in payload && typeof payload.computeValue === "function"
  );
};

export const DevTools = ({ isConnected, isSending, onSend }: DevToolsProps) => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [params, setParams] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status | null>(null);
  const [isCustomEnabled, setIsCustomEnabled] = useState(false);
  const [customFormat, setCustomFormat] = useState<ByteFormat>("hex");
  const [customInput, setCustomInput] = useState("");

  const payloads = useMemo(() => {
    return Object.values(payloadModule).filter(
      (p): p is Payload => typeof p === "object" && p !== null && "id" in p,
    );
  }, []);

  const customBytes = useMemo(
    () => parseBytes(customInput, customFormat),
    [customInput, customFormat],
  );

  const toggleSelection = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleParamChange = (id: string, value: string) => {
    setParams((prev) => ({ ...prev, [id]: value }));
  };

  const isSendDisabled = !isConnected || isSending;

  const handleSend = async () => {
    if (isSendDisabled) return;

    const bytesList: (number[] | Uint8Array | undefined)[] = [];

    for (const p of payloads) {
      if (!selected[p.id]) continue;

      if (isComputePayload(p)) {
        try {
          const rawParam = params[p.id] ?? getExampleJson(p.id);
          const input = rawParam.trim() ? JSON.parse(rawParam) : undefined;
          bytesList.push(p.computeValue(input));
        } catch {
          setStatus({
            text: `Error: Invalid JSON for ${p.name}`,
            isError: true,
          });
          return;
        }
      } else {
        bytesList.push(p.value);
      }
    }

    if (isCustomEnabled) {
      if (!customBytes.ok) {
        setStatus({
          text: `Error: Custom payload — ${customBytes.error}`,
          isError: true,
        });
        return;
      }
      if (customBytes.bytes.length) bytesList.push(customBytes.bytes);
    }

    if (bytesList.length === 0) {
      setStatus({ text: "No payloads selected", isError: false });
      return;
    }

    setStatus({ text: "Sending...", isError: false });
    const { ok, error } = await onSend(bytesList);

    setStatus(
      ok
        ? { text: "Payloads sent successfully!", isError: false }
        : {
            text: `Failed: ${error?.message ?? "Unknown error"}`,
            isError: true,
          },
    );
  };

  const handleClear = () => {
    setSelected({});
    setParams({});
    setStatus(null);
    setIsCustomEnabled(false);
    setCustomInput("");
  };

  if (!payloads.length) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h3 className={styles.title}>Payload Sender</h3>
      </header>

      <div className={styles.list}>
        {payloads.map((p) => (
          <div key={p.id} className={styles.payloadItem}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={!!selected[p.id]}
                onChange={() => toggleSelection(p.id)}
                className={styles.checkbox}
              />
              <span className={styles.payloadName}>{p.name}</span>
              <span className={styles.payloadCategory}>({p.category})</span>
            </label>

            {isComputePayload(p) && (
              <div className={styles.paramEditor}>
                <div className={styles.label}>Parameters (JSON)</div>
                <textarea
                  className={styles.textarea}
                  aria-label={`${p.name} parameters`}
                  value={params[p.id] ?? getExampleJson(p.id)}
                  onChange={(e) => handleParamChange(p.id, e.target.value)}
                  disabled={!selected[p.id]}
                />
              </div>
            )}
          </div>
        ))}

        <div className={`${styles.payloadItem} ${styles.customItem}`}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isCustomEnabled}
              onChange={() => setIsCustomEnabled((current) => !current)}
              className={styles.checkbox}
            />
            <span className={styles.payloadName}>Custom bytes</span>
            <span className={styles.payloadCategory}>(raw)</span>
          </label>

          <div className={styles.paramEditor}>
            <fieldset className={styles.formats} disabled={!isCustomEnabled}>
              <legend className={styles.label}>Format</legend>
              {(["hex", "decimal"] as const).map((format) => (
                <label key={format} className={styles.formatOption}>
                  <input
                    type="radio"
                    name="custom-byte-format"
                    checked={customFormat === format}
                    onChange={() => setCustomFormat(format)}
                  />
                  {format === "hex" ? "Hex" : "Decimal"}
                </label>
              ))}
            </fieldset>

            <label className={styles.label} htmlFor="custom-bytes">
              Bytes
            </label>
            <textarea
              id="custom-bytes"
              className={`${styles.textarea} ${styles.byteInput}`}
              value={customInput}
              placeholder={PLACEHOLDERS[customFormat]}
              onChange={(e) => setCustomInput(e.target.value)}
              disabled={!isCustomEnabled}
              spellCheck={false}
            />

            {isCustomEnabled && customInput.trim() !== "" && (
              <div
                className={
                  customBytes.ok ? styles.bytePreview : styles.byteError
                }
              >
                {customBytes.ok
                  ? `${customBytes.bytes.length} byte${customBytes.bytes.length === 1 ? "" : "s"} → ${toHexPreview(customBytes.bytes)}`
                  : customBytes.error}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.btnPrimary}`}
            onClick={handleSend}
            disabled={isSendDisabled}
          >
            {isSending ? "Sending…" : "Send Selected"}
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.btnSecondary}`}
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
        {status && (
          <div
            className={`${styles.status} ${status.isError ? styles.errorText : styles.successText}`}
            role="status"
          >
            {status.text}
          </div>
        )}
      </footer>
    </div>
  );
};

export default DevTools;
