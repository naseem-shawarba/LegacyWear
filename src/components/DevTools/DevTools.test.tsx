import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DevTools } from "./DevTools";

const renderDevTools = (
  props: Partial<React.ComponentProps<typeof DevTools>> = {},
) =>
  render(
    <DevTools
      isConnected={true}
      isSending={false}
      onSend={jest.fn()}
      {...props}
    />,
  );

describe("DevTools", () => {
  describe("Connection and Sending States", () => {
    it("cannot send while the device is disconnected", () => {
      const { rerender } = renderDevTools({ isConnected: false });

      expect(
        screen.getByRole("button", { name: /send selected/i }),
      ).toBeDisabled();

      rerender(
        <DevTools isConnected={true} isSending={false} onSend={jest.fn()} />,
      );

      expect(
        screen.getByRole("button", { name: /send selected/i }),
      ).toBeEnabled();
    });

    it("cannot send while a send is already in flight", async () => {
      const user = userEvent.setup();
      const onSend = jest.fn();
      renderDevTools({ isSending: true, onSend });

      const sendButton = screen.getByRole("button", { name: /sending/i });
      expect(sendButton).toBeDisabled();

      await user.click(sendButton);
      expect(onSend).not.toHaveBeenCalled();
    });
  });

  describe("Payload Selection and Sending", () => {
    it("warns instead of sending when nothing is selected", async () => {
      const user = userEvent.setup();
      const onSend = jest.fn();
      renderDevTools({ onSend });

      await user.click(screen.getByRole("button", { name: /send selected/i }));

      expect(screen.getByRole("status")).toHaveTextContent(
        "No payloads selected",
      );
      expect(onSend).not.toHaveBeenCalled();
    });

    it("sends the selected payload bytes through the injected sender", async () => {
      const user = userEvent.setup();
      const onSend = jest.fn().mockResolvedValue({ ok: true });
      renderDevTools({ onSend });

      await user.click(
        screen.getByRole("checkbox", { name: /Start Sync Indicator/i }),
      );
      await user.click(screen.getByRole("button", { name: /send selected/i }));

      expect(onSend).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("status")).toHaveTextContent(
        "Payloads sent successfully!",
      );
    });

    it("surfaces the error returned by the sender and applies error styling", async () => {
      const user = userEvent.setup();
      const onSend = jest.fn().mockResolvedValue({
        ok: false,
        error: new Error("GATT write failed"),
      });
      renderDevTools({ onSend });

      await user.click(
        screen.getByRole("checkbox", { name: /Start Sync Indicator/i }),
      );
      await user.click(screen.getByRole("button", { name: /send selected/i }));

      const status = screen.getByRole("status");
      expect(status).toHaveTextContent("Failed: GATT write failed");
      expect(status.className).toContain("errorText");
    });

    it("applies success styling on successful send", async () => {
      const user = userEvent.setup();
      const onSend = jest.fn().mockResolvedValue({ ok: true });
      renderDevTools({ onSend });

      await user.click(
        screen.getByRole("checkbox", { name: /Start Sync Indicator/i }),
      );
      await user.click(screen.getByRole("button", { name: /send selected/i }));

      const status = screen.getByRole("status");
      expect(status.className).toContain("successText");
    });

    it("clears the selection, custom bytes and status", async () => {
      const user = userEvent.setup();
      renderDevTools({ onSend: jest.fn() });

      const checkbox = screen.getByRole("checkbox", {
        name: /Start Sync Indicator/i,
      });
      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      const custom = screen.getByRole("checkbox", { name: /custom bytes/i });
      await user.click(custom);
      await user.type(screen.getByLabelText("Bytes"), "01 FF");

      await user.click(screen.getByRole("button", { name: /clear/i }));

      expect(checkbox).not.toBeChecked();
      expect(custom).not.toBeChecked();
      expect(screen.getByLabelText("Bytes")).toHaveValue("");
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  describe("JSON Parameter Editor", () => {
    it("rejects malformed JSON parameters before calling the sender", async () => {
      const user = userEvent.setup();
      const onSend = jest.fn();
      renderDevTools({ onSend });

      await user.click(screen.getByRole("checkbox", { name: /set alarm/i }));

      const textarea = screen.getByRole("textbox", {
        name: /set alarm parameters/i,
      });
      await user.clear(textarea);
      await user.type(textarea, "{{ not json");

      await user.click(screen.getByRole("button", { name: /send selected/i }));

      expect(screen.getByRole("status")).toHaveTextContent(
        "Error: Invalid JSON for Set Alarm",
      );
      expect(onSend).not.toHaveBeenCalled();
    });

    it("parses and sends updated valid JSON parameters", async () => {
      const user = userEvent.setup();
      const onSend = jest.fn().mockResolvedValue({ ok: true });
      renderDevTools({ onSend });

      await user.click(screen.getByRole("checkbox", { name: /set alarm/i }));
      const textarea = screen.getByRole("textbox", {
        name: /set alarm parameters/i,
      });

      await user.clear(textarea);
      // Double brace `{{` escapes `{` in @testing-library/user-event v14+
      await user.type(textarea, '{{"time": "08:00", "repeat": true}');
      await user.click(screen.getByRole("button", { name: /send selected/i }));

      expect(onSend).toHaveBeenCalledTimes(1);
    });

    it("rejects empty parameters as invalid JSON", async () => {
      const user = userEvent.setup();
      const onSend = jest.fn();
      renderDevTools({ onSend });

      await user.click(screen.getByRole("checkbox", { name: /set alarm/i }));
      const textarea = screen.getByRole("textbox", {
        name: /set alarm parameters/i,
      });

      await user.clear(textarea); // Leaves an empty string
      await user.click(screen.getByRole("button", { name: /send selected/i }));

      // Empty string fails JSON.parse, catching the error before sending
      expect(screen.getByRole("status")).toHaveTextContent(
        "Error: Invalid JSON for Set Alarm",
      );
      expect(onSend).not.toHaveBeenCalled();
    });
  });

  describe("Custom Bytes", () => {
    const enableCustom = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByRole("checkbox", { name: /custom bytes/i }));
      return screen.getByLabelText("Bytes");
    };

    it("keeps the field disabled until it is switched on", () => {
      renderDevTools();

      expect(screen.getByLabelText("Bytes")).toBeDisabled();
    });

    it("previews the parsed bytes as the user types", async () => {
      const user = userEvent.setup();
      renderDevTools();

      await user.type(await enableCustom(user), "01 ff a0");

      expect(screen.getByText("3 bytes → 01 FF A0")).toBeInTheDocument();
    });

    it("reads the field as decimal when that format is picked", async () => {
      const user = userEvent.setup();
      const onSend = jest.fn().mockResolvedValue({ ok: true });
      renderDevTools({ onSend });

      const input = await enableCustom(user);
      await user.click(screen.getByRole("radio", { name: /decimal/i }));
      await user.type(input, "1, 255, 160");

      expect(screen.getByText("3 bytes → 01 FF A0")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /send selected/i }));

      expect(onSend).toHaveBeenCalledWith([[1, 255, 160]]);
    });

    it("sends custom bytes after the selected presets", async () => {
      const user = userEvent.setup();
      const onSend = jest.fn().mockResolvedValue({ ok: true });
      renderDevTools({ onSend });

      await user.click(
        screen.getByRole("checkbox", { name: /Start Sync Indicator/i }),
      );
      await user.type(await enableCustom(user), "0a0b");
      await user.click(screen.getByRole("button", { name: /send selected/i }));

      const [bytesList] = onSend.mock.calls[0];
      expect(bytesList).toHaveLength(2);
      expect(bytesList[1]).toEqual([10, 11]);
    });

    it("refuses to send an unparseable value", async () => {
      const user = userEvent.setup();
      const onSend = jest.fn();
      renderDevTools({ onSend });

      await user.type(await enableCustom(user), "zz");

      expect(screen.getByText('"zz" is not a hex value')).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /send selected/i }));

      expect(onSend).not.toHaveBeenCalled();
      expect(screen.getByRole("status")).toHaveTextContent(
        'Error: Custom payload — "zz" is not a hex value',
      );
    });

    it("is ignored while switched off", async () => {
      const user = userEvent.setup();
      const onSend = jest.fn();
      renderDevTools({ onSend });

      await user.type(await enableCustom(user), "01");
      await user.click(screen.getByRole("checkbox", { name: /custom bytes/i }));

      await user.click(screen.getByRole("button", { name: /send selected/i }));

      expect(onSend).not.toHaveBeenCalled();
      expect(screen.getByRole("status")).toHaveTextContent(
        "No payloads selected",
      );
    });
  });
});
