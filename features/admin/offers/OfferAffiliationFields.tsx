"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { propertiesService } from "@/features/admin/projects/properties.service";
import { unitsService } from "@/features/admin/units/units.service";
import {
  INDEPENDENT_PROJECT_ID,
  independentProjectLabel,
  projectNameFromId,
  unitDisplayNumber,
  unitsForProject,
} from "./offer-affiliation";

export type OfferAffiliationValue = {
  projectId: string;
  projectName: string;
  unitId: string;
  unitNumber: string;
};

type OfferAffiliationFieldsProps = {
  value: OfferAffiliationValue;
  onChange: (next: OfferAffiliationValue) => void;
  inputClass: string;
  labelClass: string;
  isRtl: boolean;
};

export function OfferAffiliationFields({
  value,
  onChange,
  inputClass,
  labelClass,
  isRtl,
}: OfferAffiliationFieldsProps) {
  const { data: properties = [], isLoading: loadingProjects } = useQuery({
    queryKey: ["properties"],
    queryFn: () => propertiesService.getProperties(),
  });

  const { data: units = [], isLoading: loadingUnits } = useQuery({
    queryKey: ["units"],
    queryFn: () => unitsService.getUnits(),
  });

  const filteredUnits = useMemo(
    () => unitsForProject(units, value.projectId),
    [units, value.projectId]
  );

  const selectClass = `${inputClass} appearance-none pr-4 pl-10`;

  const handleProjectChange = (projectId: string) => {
    onChange({
      projectId,
      projectName: projectNameFromId(projectId, properties, isRtl),
      unitId: "",
      unitNumber: "",
    });
  };

  const handleUnitChange = (unitId: string) => {
    const unit = filteredUnits.find((item) => item.id === unitId);
    onChange({
      ...value,
      projectName: projectNameFromId(value.projectId, properties, isRtl) || value.projectName,
      unitId,
      unitNumber: unit ? unitDisplayNumber(unit, properties) : "",
    });
  };

  return (
    <>
      <div>
        <label className={labelClass}>{isRtl ? "المشروع" : "Project"}</label>
        <div className="relative">
          <select
            required
            value={value.projectId}
            disabled={loadingProjects}
            onChange={(event) => handleProjectChange(event.target.value)}
            className={selectClass}
          >
            <option value="">{isRtl ? "اختر المشروع" : "Select project"}</option>
            <option value={INDEPENDENT_PROJECT_ID}>{independentProjectLabel(isRtl)}</option>
            {properties.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
        </div>
      </div>

      <div className="sm:col-start-2">
        <label className={labelClass}>{isRtl ? "الوحدة" : "Unit"}</label>
        <div className="relative">
          <select
            required
            value={value.unitId}
            disabled={!value.projectId || loadingUnits}
            onChange={(event) => handleUnitChange(event.target.value)}
            className={selectClass}
          >
            <option value="">
              {!value.projectId
                ? (isRtl ? "اختر المشروع أولاً" : "Select a project first")
                : filteredUnits.length === 0
                  ? (isRtl ? "لا توجد وحدات" : "No units")
                  : (isRtl ? "اختر الوحدة" : "Select unit")}
            </option>
            {filteredUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unitDisplayNumber(unit, properties)}
                {unit.unitType ? ` — ${unit.unitType}` : ""}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
        </div>
      </div>
    </>
  );
}
