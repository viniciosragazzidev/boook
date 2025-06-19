/**
 * Utilitários para manipulação de localStorage com tipagem
 */

export const storage = {
  /**
   * Salva dados no localStorage com serialização JSON
   */
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  },

  /**
   * Recupera dados do localStorage com deserialização JSON
   */
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return defaultValue;
    }
  },

  /**
   * Remove item do localStorage
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  },

  /**
   * Verifica se uma chave existe no localStorage
   */
  has: (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  }
};

/**
 * Gera UUID simples para IDs locais
 */
export const generateId = (): string => {
  return 'book_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};
