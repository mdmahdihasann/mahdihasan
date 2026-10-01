import { Workflow } from "lucide-react";
import type { CSSProperties } from "react";

import { process } from "@/data/process";

import PanelHead from "./PanelHead";

/**
 * Six steps on one lit rail. The numbers carry the order, so they stay.
 * `--i` is each step's place on the rail; the CSS uses it to light the node
 * as the drawing line and the looping comet reach it.
 */
const Process = () => (
  <section id="process" className="panel reveal" aria-labelledby="process-title">
    <PanelHead icon={Workflow} title="My Work Process" id="process-title" />

    <ol className="process-rail">
      {process.map(({ icon: Icon, name, desc }, i) => (
        <li className="process-step" key={name} style={{ "--i": i } as CSSProperties}>
          <span className="process-node" aria-hidden>
            <Icon size={22} strokeWidth={1.7} />
          </span>
          <span className="process-num" aria-hidden>
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3>{name}</h3>
          <p>{desc}</p>
        </li>
      ))}
    </ol>
  </section>
);

export default Process;
