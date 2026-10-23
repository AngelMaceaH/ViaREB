import React, { useState } from "react";
import { EmptyPage } from "../../components/pages/EmptyPage";
import { initialDrivers } from "../../data/mockDrivers";

export function DriversPage() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    licenseNumber: "",
    phoneNumber: "",
    isActive: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errorMsg) setErrorMsg("");
  };

  const handleOpenModal = () => {
    setFormData({
      fullName: "",
      licenseNumber: "",
      phoneNumber: "",
      isActive: true,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar nombre completo
    if (!formData.fullName.trim()) {
      setErrorMsg("El nombre completo es obligatorio.");
      return;
    }

    // Validar número de licencia
    if (!formData.licenseNumber.trim()) {
      setErrorMsg("El número de licencia es obligatorio.");
      return;
    }

    // Validar licencia única
    const isLicenseDuplicate = drivers.some(
      (driver) =>
        driver.licenseNumber.trim().toLowerCase() ===
        formData.licenseNumber.trim().toLowerCase()
    );

    if (isLicenseDuplicate) {
      setErrorMsg("El número de licencia ya se encuentra registrado.");
      return;
    }

    // Registrar nuevo chofer
    const newDriver = {
      id: Date.now().toString(),
      fullName: formData.fullName.trim(),
      licenseNumber: formData.licenseNumber.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      isActive: formData.isActive,
    };

    // TODO: Reemplazar con llamadas API cuando el backend esté listo (POST /api/fleet/drivers)
    setDrivers((prev) => [newDriver, ...prev]);
    handleCloseModal();
  };

  return (
    <EmptyPage
      title="Choferes"
      description="Conductores asignados a horarios e inventario de la flota."
    >
      <div className="space-y-6">
        {/* Barra superior de acciones */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">
            Total de registros: <span className="font-semibold text-gray-800">{drivers.length}</span>
          </div>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm text-sm flex items-center gap-2"
          >
            <span>+</span> Registrar Chofer
          </button>
        </div>

        {/* Tabla de Choferes / Estado vacío */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {drivers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg font-medium">No hay choferes registrados</p>
              <p className="text-sm mt-1">Haz clic en "Registrar Chofer" para agregar el primero.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Nombre Completo</th>
                    <th className="py-3 px-6">Nº Licencia</th>
                    <th className="py-3 px-6">Teléfono</th>
                    <th className="py-3 px-6">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {drivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{driver.fullName}</td>
                      <td className="py-4 px-6 font-mono text-gray-600">{driver.licenseNumber}</td>
                      <td className="py-4 px-6">
                        {driver.phoneNumber ? driver.phoneNumber : <span className="text-gray-400 italic">N/A</span>}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            driver.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {driver.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Formulario */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Registrar Nuevo Chofer</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nº Licencia *
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="Ej. LIC-998877"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono (Opcional)
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Ej. +504 9900-1122"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Estado Activo
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </EmptyPage>
  );
}