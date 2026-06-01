export type Capability = 'fs:read' | 'fs:write' | 'graph:query' | 'ai:embed' | 'ui:register';

export interface PluginContext {
  permissions: Capability[];
  readonly graph: any; // Knowledge Graph Engine Reference
  readonly ai: any; // AI Provider Reference
}

export interface MyceliumPlugin {
  name: string;
  version: string;
  requiredCapabilities: Capability[];
  
  /**
   * Called when the plugin is first loaded.
   */
  load?(context: PluginContext): Promise<void>;
  
  /**
   * Called to initialize the plugin with state.
   */
  init?(context: PluginContext): Promise<void>;
  
  /**
   * Called when the plugin becomes active and should bind UI/hooks.
   */
  activate(context: PluginContext): Promise<void>;
  
  /**
   * Called when the plugin is deactivated or uninstalled.
   */
  deactivate?(context: PluginContext): Promise<void>;
}
