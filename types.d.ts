
/**
 * Preexisting translation unit.
 */
export interface TranslationUnit {

  id: string,

  source: string,

  target: string,

  [other: string]: string

}
