import React, { createContext, useState, useContext, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos desde localStorage al iniciar
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Añadir o quitar un producto de favoritos
  const toggleFavorite = (product) => {
    const existingIndex = favorites.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      // Si ya existe, lo quitamos
      const newFavorites = [...favorites];
      newFavorites.splice(existingIndex, 1);
      setFavorites(newFavorites);
      return false; // Retorna false indicando que se quitó de favoritos
    } else {
      // Si no existe, lo añadimos
      setFavorites([...favorites, product]);
      return true; // Retorna true indicando que se añadió a favoritos
    }
  };

  // Verificar si un producto está en favoritos
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  // Eliminar un producto de favoritos
  const removeFavorite = (productId) => {
    setFavorites(favorites.filter(item => item.id !== productId));
  };

  // Limpiar todos los favoritos
  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      removeFavorite,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook personalizado para usar el contexto de favoritos
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe ser usado dentro de un FavoritesProvider');
  }
  return context;
};