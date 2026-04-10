import type {
  IMyceliumError,
  NonOptional,
  NoteProps,
  Decoration,
  MyceliumConfig,
  ReducedDEngine,
} from "@myceliumhq/common-all";
import { Node } from "hast";
import { MyceliumASTNode } from "../types";

export { DECORATION_TYPES } from "@myceliumhq/common-all";
export type { Decoration };

export type DecoratorOut<D extends Decoration = Decoration> = {
  decorations: D[];
  errors?: IMyceliumError[];
};

export type DecoratorIn<N extends Omit<MyceliumASTNode, "children"> = Node> = {
  node: NonOptional<N, "position">;
  note: NoteProps;
  noteText: string;
  engine: ReducedDEngine;
  config: MyceliumConfig;
};

export type Decorator<
  N extends Omit<MyceliumASTNode, "children">,
  D extends Decoration = Decoration
> = (opts: DecoratorIn<N>) => DecoratorOut<D> | Promise<DecoratorOut<D>>;
