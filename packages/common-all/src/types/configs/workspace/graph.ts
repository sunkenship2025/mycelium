/**
 * Namespace for all graph related configurations.
 */
export type MyceliumGraphConfig = {
  zoomSpeed: number;
  /**
   * If true, create a note if it hasn't been created already when clicked on a graph node
   */
  createStub: boolean;
};

/**
 * Generates default {@link MyceliumGraphConfig}
 * @returns MyceliumGraphConfig
 */
export function genDefaultGraphConfig(): MyceliumGraphConfig {
  return {
    zoomSpeed: 1,
    createStub: false,
  };
}
