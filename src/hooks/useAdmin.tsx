import { useEffect, useState } from "react";
import { database } from "../config/firebase";

export default function useAdmin(uid?: string) {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (uid) {
      setLoading(true);
      database
        .collection("users")
        .doc(uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setIsAdmin((doc.data() as any).admin);
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [uid]);

  return [isAdmin, loading];
}
