"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type CarData = {
  _id: string;
  model: string;
  company: string;
  color: string;
  status: string;
  releaseDate: string;
  unitsSold: number;
};

export default function CarTable() {
  const [cars, setCars] = useState<CarData[]>([]);
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const API_URL = "http://localhost:5000/api/cars";

  // Fetch cars from backend
  useEffect(() => {
    axios.get(API_URL).then((response) => setCars(response.data)).catch(console.error);
  }, []);

  // Open modal
  const openModal = (car: CarData | null = null) => {
    setSelectedCar(car);
    setModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const newCar = {
      model: formData.get("model") as string,
      company: formData.get("company") as string,
      color: formData.get("color") as string,
      status: formData.get("status") as string,
      releaseDate: formData.get("releaseDate") as string,
      unitsSold: Number(formData.get("unitsSold")),
    };

    if (selectedCar) {
      await axios.put(`${API_URL}/${selectedCar._id}`, newCar);
      setCars(cars.map((car) => (car._id === selectedCar._id ? { ...car, ...newCar } : car)));
    } else {
      const response = await axios.post(API_URL, newCar);
      setCars([...cars, response.data]);
    }
    setModalOpen(false);
  };

  // Delete selected cars
  const deleteSelected = async () => {
    await axios.post(`${API_URL}/delete`, { ids: selectedIds });
    setCars(cars.filter((car) => !selectedIds.includes(car._id)));
    setSelectedIds([]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <Button onClick={() => openModal(null)}>Add Car</Button>
        <Button variant="destructive" onClick={deleteSelected} disabled={selectedIds.length === 0}>
          Delete Selected
        </Button>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead>Units Sold</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car._id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(car._id)}
                  onCheckedChange={() =>
                    setSelectedIds((prev) =>
                      prev.includes(car._id) ? prev.filter((id) => id !== car._id) : [...prev, car._id]
                    )
                  }
                />
              </TableCell>
              <TableCell>{car.model}</TableCell>
              <TableCell>{car.company}</TableCell>
              <TableCell>{car.color}</TableCell>
              <TableCell>{car.status}</TableCell>
              <TableCell>{car.releaseDate}</TableCell>
              <TableCell>{car.unitsSold.toLocaleString()}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline" onClick={() => openModal(car)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCar ? "Edit Car" : "Add Car"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="model" defaultValue={selectedCar?.model || ""} placeholder="Car Model" required />
            <Input name="company" defaultValue={selectedCar?.company || ""} placeholder="Company" required />
            <Input name="color" defaultValue={selectedCar?.color || ""} placeholder="Color" required />
            <Input type="date" name="releaseDate" defaultValue={selectedCar?.releaseDate || ""} required />
            <Input type="number" name="unitsSold" defaultValue={selectedCar?.unitsSold || 0} placeholder="Units Sold" required />

            <Select name="status" defaultValue={selectedCar?.status || "available"}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <DialogFooter>
              <Button type="submit">{selectedCar ? "Save Changes" : "Add Car"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

