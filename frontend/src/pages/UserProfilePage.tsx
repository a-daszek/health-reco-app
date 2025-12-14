// frontend/src/pages/UserProfilePage.tsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBloodResults,
  postBloodResult,
  deleteBloodResult,
  getAiRecommendation,
} from "@/api";
import type { BloodType } from "../../../backend/src/shared/types"; // możesz zamienić na lokalny typ
import { useAppContext } from "../../contexts/AppContext";
import { getSimpleRecommendation } from "@/utils/bloodRecommendations";

const UserProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<
    Record<string, string[]>
  >({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

  const { showToast } = useAppContext();
  const {
    data: results = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["bloodResults"],
    queryFn: getBloodResults,
  });

  const mutation = useMutation({
    mutationFn: (payload: Partial<BloodType>) => postBloodResult(payload),
    onSuccess: (newItem) => {
      // odśwież cache
      queryClient.setQueryData<BloodType[] | undefined>(
        ["bloodResults"],
        (old) => [...(old || []), newItem]
      );
      showToast({ message: "Wynik zapisany pomyślnie", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      showToast({
        message: "Błąd: " + (error?.message || "nieznany"),
        type: "ERROR",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (bloodId: string) => deleteBloodResult(bloodId),
    onSuccess: (_, bloodId) => {
      queryClient.setQueryData<BloodType[]>(["bloodResults"], (old) =>
        old ? old.filter((b) => b._id !== bloodId) : []
      );
      showToast({ message: "Wynik usunięty pomyślnie", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      showToast({
        message: "Błąd: " + (error?.message || "nieznany"),
        type: "ERROR",
      });
    },
  });

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    hemoglobin: "",
    wbc: "",
    platelets: "",
    glucose: "",
    cholesterolTotal: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date)
      return showToast({
        message: "Błąd: data jest wymagana",
        type: "ERROR",
      });

    const payload: Partial<BloodType> = {
      date: new Date(form.date).toISOString(),
      hemoglobin: form.hemoglobin ? Number(form.hemoglobin) : undefined,
      wbc: form.wbc ? Number(form.wbc) : undefined,
      platelets: form.platelets ? Number(form.platelets) : undefined,
      glucose: form.glucose ? Number(form.glucose) : undefined,
      cholesterolTotal: form.cholesterolTotal
        ? Number(form.cholesterolTotal)
        : undefined,
    };

    mutation.mutate(payload);
  };
  const handleAiRecommendation = async (r: BloodType) => {
    setAiLoading((prev) => ({ ...prev, [r._id]: true }));

    try {
      const recs = await getAiRecommendation(r);
      setAiRecommendations((prev) => ({ ...prev, [r._id]: recs }));
    } catch (error) {
      console.error(error);
      setAiRecommendations((prev) => ({
        ...prev,
        [r._id]: ["Błąd podczas pobierania rekomendacji AI."],
      }));
    } finally {
      setAiLoading((prev) => ({ ...prev, [r._id]: false }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Twój profil — wyniki krwi</h2>

      <section className="mb-6">
        <h3 className="font-semibold">Dodaj wynik</h3>
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 grid-cols-1 md:grid-cols-2 bg-red-50 p-4 rounded"
        >
          <label>
            Data
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full"
            />
          </label>
          <label>
            Hemoglobina (g/dL)
            <input
              name="hemoglobin"
              value={form.hemoglobin}
              onChange={handleChange}
              type="number"
              step="0.1"
            />
          </label>
          <label>
            WBC (10^9/L)
            <input
              name="wbc"
              value={form.wbc}
              onChange={handleChange}
              type="number"
              step="0.1"
            />
          </label>
          <label>
            Płytki (10^9/L)
            <input
              name="platelets"
              value={form.platelets}
              onChange={handleChange}
              type="number"
              step="1"
            />
          </label>
          <label>
            Glukoza (mg/dL)
            <input
              name="glucose"
              value={form.glucose}
              onChange={handleChange}
              type="number"
              step="1"
            />
          </label>
          <label>
            Cholesterol (mg/dL)
            <input
              name="cholesterolTotal"
              value={form.cholesterolTotal}
              onChange={handleChange}
              type="number"
              step="1"
            />
          </label>

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 rounded bg-red-700 text-white"
            >
              {mutation.isPending ? "Zapis..." : "Zapisz wynik"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h3 className="font-semibold">Historia wyników</h3>
        {isPending ? (
          <p>Ładowanie...</p>
        ) : isError ? (
          <p>Błąd podczas pobierania wyników.</p>
        ) : results.length === 0 ? (
          <p>Brak zapisanych wyników.</p>
        ) : (
          <table className="w-full text-sm text-left border border-red-300">
            <thead>
              <tr>
                <th>Data</th>
                <th>Hb</th>
                <th>WBC</th>
                <th>Płytki</th>
                <th>Glukoza</th>
                <th>Chol.</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => {
                const isExpanded = expandedResultId === r._id;
                const recommendations = isExpanded
                  ? getSimpleRecommendation(r)
                  : [];

                return (
                  <React.Fragment key={r._id}>
                    <tr className="border-b">
                      <td>{new Date(r.date).toLocaleDateString()}</td>
                      <td>{r.hemoglobin ?? "-"}</td>
                      <td>{r.wbc ?? "-"}</td>
                      <td>{r.platelets ?? "-"}</td>
                      <td>{r.glucose ?? "-"}</td>
                      <td>{r.cholesterolTotal ?? "-"}</td>
                      <td className="space-x-3">
                        <button
                          onClick={() =>
                            setExpandedResultId(isExpanded ? null : r._id)
                          }
                          className="text-sky-600 hover:underline"
                        >
                          {isExpanded ? "Ukryj rekomendację" : "Rekomendacja"}
                        </button>

                        <button
                          onClick={() => handleAiRecommendation(r)}
                          className="text-purple-600 hover:underline"
                        >
                          {aiLoading[r._id]
                            ? "Ładowanie..."
                            : "Szczegółowa rekomendacja AI"}
                        </button>

                        <button
                          onClick={() => {
                            if (
                              confirm("Czy na pewno chcesz usunąć ten wynik?")
                            ) {
                              deleteMutation.mutate(r._id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:underline"
                        >
                          Usuń
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-red-50">
                        <td colSpan={7} className="p-3 text-sm">
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                    {aiRecommendations[r._id] &&
                      aiRecommendations[r._id].length > 0 && (
                        <tr className="bg-purple-50">
                          <td colSpan={7} className="p-3 text-sm">
                            <ul className="list-disc pl-5 space-y-1 text-gray-800">
                              {aiRecommendations[r._id].map((rec, idx) => (
                                <li key={idx}>{rec}</li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default UserProfilePage;
