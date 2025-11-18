// Type definitions for mtb v0.2.0
// Project: https://github.com/DiegoVallejoDev/mtb
// Definitions by: Diego Vallejo

/// <reference types="node" />

export interface MtbConfig {
  directories: {
    components: string;
    pages: string;
    output: string;
  };
  watch?: boolean;
  verbose?: boolean;
}

export interface RunOptions {
  configPath?: string;
  verbose?: boolean;
  quiet?: boolean;
}

export interface BuildOptions {
  watch?: boolean;
  production?: boolean;
  changed?: boolean;
  debug?: boolean;
  verbose?: boolean;
  quiet?: boolean;
}

export interface ComponentInfo {
  name: string;
  path: string;
  content: string;
}

export interface PageInfo {
  name: string;
  path: string;
  components: string[];
}

export interface BuildResult {
  pages: number;
  components: number;
  duration: number;
  errors: Error[];
}

export interface LoggerOptions {
  verbose?: boolean;
  quiet?: boolean;
}

// Legacy API functions
/**
 * Register a component from a file path (synchronous for backward compatibility)
 * @param componentPath - Path to component file
 * @param name - Optional component name
 */
export function registerComponent(componentPath: string, name?: string): void;

/**
 * Get a registered component's content
 * @param name - Component name
 * @returns Component content or undefined
 */
export function getComponent(name: string): string | undefined;

/**
 * Get a page's content
 * @param name - Page filename
 * @returns Page content
 */
export function getPage(name: string): string;

/**
 * Compile components in a page
 * @param page - Page name (without extension)
 * @returns Compiled content or undefined
 */
export function compileComponents(page: string): string | undefined;

/**
 * Create pages (synchronous)
 */
export function createPages(): void;

/**
 * Prepare pages (synchronous)
 */
export function preparePages(): void;

/**
 * Main run function using new modular architecture
 * @param options - Configuration options
 */
export function run(options?: RunOptions): Promise<void>;

// Config class
export class Config {
  constructor(configPath?: string | null);
  
  /**
   * Get a configuration value by key
   * @param key - Configuration key (supports dot notation like 'directories.components')
   */
  get(key: string): any;
  
  /**
   * Set a configuration value
   * @param key - Configuration key
   * @param value - Value to set
   */
  set(key: string, value: any): void;
  
  /**
   * Get all configuration
   */
  getAll(): MtbConfig;
}

// ComponentRegistry class
export class ComponentRegistry {
  constructor(fileManager: FileManager, logger: Logger);
  
  /**
   * Register a component from a file path
   * @param componentPath - Path to the component file
   * @param name - Optional component name
   * @returns The component name
   */
  register(componentPath: string, name?: string): Promise<string>;
  
  /**
   * Get a component's content
   * @param name - Component name
   * @returns Component content
   * @throws ComponentNotFoundError if component not found
   */
  get(name: string): string;
  
  /**
   * Check if a component exists
   * @param name - Component name
   * @returns True if component exists
   */
  has(name: string): boolean;
  
  /**
   * Get all component names
   * @returns Array of component names
   */
  getAll(): string[];
  
  /**
   * Get the count of registered components
   * @returns Number of components
   */
  count(): number;
  
  /**
   * Clear all registered components
   */
  clear(): void;
}

// PageCompiler class
export class PageCompiler {
  constructor(componentRegistry: ComponentRegistry, fileManager: FileManager, logger: Logger);
  
  /**
   * Load a page from file
   * @param pageName - Name of the page file
   * @param pagesDir - Pages directory path
   */
  loadPage(pageName: string, pagesDir: string): Promise<void>;
  
  /**
   * Load all pages from a directory
   * @param pagesDir - Pages directory path
   */
  loadAllPages(pagesDir: string): Promise<void>;
  
  /**
   * Compile a page by replacing component placeholders
   * @param pageName - Name of the page (without extension)
   * @param depth - Current recursion depth
   * @param visited - Set of visited components
   * @returns Compiled page content
   * @throws PageNotFoundError if page not found
   * @throws CompilationError if compilation fails
   */
  compile(pageName: string, depth?: number, visited?: Set<string>): string;
  
  /**
   * Compile and write a page to the output directory
   * @param pageName - Name of the page (without extension)
   * @param outputDir - Output directory path
   */
  compilePage(pageName: string, outputDir: string): Promise<void>;
  
  /**
   * Compile and write all pages to the output directory
   * @param outputDir - Output directory path
   */
  compileAllPages(outputDir: string): Promise<void>;
  
  /**
   * Get the count of loaded pages
   * @returns Number of pages
   */
  getPageCount(): number;
  
  /**
   * Get all page names
   * @returns Array of page names
   */
  getAllPageNames(): string[];
  
  /**
   * Clear all loaded pages
   */
  clear(): void;
}

// FileManager class
export class FileManager {
  constructor(config: Config);
  
  /**
   * Read a file asynchronously
   * @param filePath - Path to the file
   * @returns File content
   */
  readFile(filePath: string): Promise<string>;
  
  /**
   * Write a file asynchronously
   * @param filePath - Path to the file
   * @param content - Content to write
   */
  writeFile(filePath: string, content: string): Promise<void>;
  
  /**
   * Read directory contents asynchronously
   * @param dirPath - Path to the directory
   * @returns Array of filenames
   */
  readDirectory(dirPath: string): Promise<string[]>;
  
  /**
   * Ensure directory exists, create if it doesn't
   * @param dirPath - Path to the directory
   */
  ensureDirectory(dirPath: string): Promise<void>;
  
  /**
   * Check if a file or directory exists
   * @param filePath - Path to check
   * @returns True if exists
   */
  exists(filePath: string): Promise<boolean>;
  
  /**
   * Check if a file or directory exists (synchronous)
   * @param filePath - Path to check
   * @returns True if exists
   */
  existsSync(filePath: string): boolean;
}

// Logger class
export class Logger {
  constructor(options?: LoggerOptions);
  
  /**
   * Log a message
   * @param message - Message to log
   * @param level - Log level
   */
  log(message: string, level?: 'info' | 'success' | 'warning' | 'error' | 'debug'): void;
  
  /**
   * Log an info message
   * @param message - Message to log
   */
  info(message: string): void;
  
  /**
   * Log a success message
   * @param message - Message to log
   */
  success(message: string): void;
  
  /**
   * Log a warning message
   * @param message - Message to log
   */
  warning(message: string): void;
  
  /**
   * Log an error message
   * @param message - Message to log
   */
  error(message: string): void;
  
  /**
   * Log a debug message (only if verbose mode is enabled)
   * @param message - Message to log
   */
  debug(message: string): void;
  
  /**
   * Log a header
   * @param message - Message to log
   */
  header(message: string): void;
  
  /**
   * Log a table
   * @param data - Data to display in table format
   */
  table(data: any): void;
}

// Error classes
export class MtbError extends Error {
  code: string;
  constructor(message: string, code: string);
}

export class ComponentNotFoundError extends MtbError {
  componentName: string;
  constructor(componentName: string);
}

export class PageNotFoundError extends MtbError {
  pageName: string;
  constructor(pageName: string);
}

export class FileReadError extends MtbError {
  filePath: string;
  originalError: Error;
  constructor(filePath: string, originalError: Error);
}

export class FileWriteError extends MtbError {
  filePath: string;
  originalError: Error;
  constructor(filePath: string, originalError: Error);
}

export class DirectoryReadError extends MtbError {
  dirPath: string;
  originalError: Error;
  constructor(dirPath: string, originalError: Error);
}

export class DirectoryCreateError extends MtbError {
  dirPath: string;
  originalError: Error;
  constructor(dirPath: string, originalError: Error);
}

export class CompilationError extends MtbError {
  pageName: string;
  errors: string[];
  constructor(pageName: string, errors: string[]);
}

// Default export
declare const mtb: {
  run: typeof run;
  registerComponent: typeof registerComponent;
  getComponent: typeof getComponent;
  getPage: typeof getPage;
  compileComponents: typeof compileComponents;
  createPages: typeof createPages;
  preparePages: typeof preparePages;
  Config: typeof Config;
  ComponentRegistry: typeof ComponentRegistry;
  PageCompiler: typeof PageCompiler;
  FileManager: typeof FileManager;
  Logger: typeof Logger;
};

export default mtb;
