import { ValueTransformer } from 'typeorm';

/**
 * MySQL renvoie les colonnes DECIMAL sous forme de string via le driver Node.
 * Ce transformer convertit proprement number <-> string pour éviter les
 * problèmes de précision liés à l'utilisation de FLOAT pour des montants
 * financiers (les erreurs d'arrondi binaire sont inacceptables sur de l'argent).
 */
export const DecimalTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) => (value === null || value === undefined ? value : parseFloat(value)),
};
