import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";

import { getSuiObjectFields } from "@/lib/utils";
import type { SuiWrappedDynamicField, PetAccessoryStruct } from "@/types/Pet";

export const queryKeyEquippedAccessories = ["owned-equipped-accessories"];

type UseQueryEquippedAccessoriesParams = {
  petId?: string;
};

export type EquippedAccessories = {
  glasses: PetAccessoryStruct | null;
  hat: PetAccessoryStruct | null;
};

export function useQueryEquippedAccessories({
  petId,
}: UseQueryEquippedAccessoriesParams) {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: [...queryKeyEquippedAccessories, petId],
    queryFn: async (): Promise<EquippedAccessories> => {
      if (!petId) return { glasses: null, hat: null };

      const dynamicFields = await suiClient.getDynamicFields({
        parentId: petId,
      });

      // Look for equipped glasses
      const glassesField = dynamicFields.data.find(
        (field) =>
          field.name.type === "0x1::string::String" &&
          field.name.value === "equipped_glasses",
      );

      // Look for equipped hat
      const hatField = dynamicFields.data.find(
        (field) =>
          field.name.type === "0x1::string::String" &&
          field.name.value === "equipped_hat",
      );

      let glasses: PetAccessoryStruct | null = null;
      let hat: PetAccessoryStruct | null = null;

      // Fetch glasses data if equipped
      if (glassesField) {
        const glassesObjectResponse = await suiClient.getDynamicFieldObject({
          parentId: petId,
          name: glassesField.name,
        });

        const wrappedGlasses =
          getSuiObjectFields<SuiWrappedDynamicField<PetAccessoryStruct>>(
            glassesObjectResponse,
          );

        if (wrappedGlasses && wrappedGlasses.value && wrappedGlasses.value.fields) {
          glasses = wrappedGlasses.value.fields;
        }
      }

      // Fetch hat data if equipped
      if (hatField) {
        const hatObjectResponse = await suiClient.getDynamicFieldObject({
          parentId: petId,
          name: hatField.name,
        });

        const wrappedHat =
          getSuiObjectFields<SuiWrappedDynamicField<PetAccessoryStruct>>(
            hatObjectResponse,
          );

        if (wrappedHat && wrappedHat.value && wrappedHat.value.fields) {
          hat = wrappedHat.value.fields;
        }
      }

      return { glasses, hat };
    },
    enabled: !!petId,
  });
}
