import { useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseAppwrite<T> {
  loading: boolean;
  data: T[];
  refetch: () => void;
}

const useAppwrite = <T>(fetchFunction: () => Promise<T[]>): UseAppwrite<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para obtener datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { loading, data, refetch };
};

export default useAppwrite;
