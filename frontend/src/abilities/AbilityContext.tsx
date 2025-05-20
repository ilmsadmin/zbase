"use client";

import { createContext, useContext, useMemo, PropsWithChildren } from "react";
import { useSession } from "next-auth/react";
import { AppAbility, createAbilityFor } from "@/abilities/defineAbility";
import { User } from "@/types/auth";

const AbilityContext = createContext<AppAbility | undefined>(undefined);

export function AbilityProvider({ children }: PropsWithChildren) {
  const { data: session } = useSession();
  const user = session?.user as User | null;

  const ability = useMemo(() => createAbilityFor(user), [user]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

export function useAbility() {
  const ability = useContext(AbilityContext);
  if (!ability) {
    throw new Error("useAbility must be used within an AbilityProvider");
  }
  return ability;
}
