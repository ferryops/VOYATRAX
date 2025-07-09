"use client";
import { useEffect, useState } from "react";
import { fetchOrderHistory } from "@/app/(actions)/orderActions";
import { createClient } from "@/utils/supabase/client";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function UserOrderHistory() {
  useDocumentTitle("Riwayat Order Tiket");
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (data.user) {
          setUserId(data.user.id);
        }
      });
  }, []);

  useEffect(() => {
    if (userId) {
      fetchOrderHistory(userId).then(({ data, error }) => {
        if (error) setError(error.message);
        else setOrders(data || []);
      });
    }
  }, [userId]);

  const TicketPDF = ({ order }: { order: any }) => (
    <Document>
      <Page size="A6" style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.title}>✈️ VoyaTrax E-Ticket</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Order ID:</Text>
            <Text style={styles.value}>{order.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tanggal:</Text>
            <Text style={styles.value}>{order.order_date?.slice(0, 10)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>Detail Tiket</Text>
            {order.order_items.map((item: any) => (
              <View key={item.id} style={styles.ticketItem}>
                <Text style={styles.route}>
                  {item.ticket.origin} → {item.ticket.destination}
                </Text>
                <Text style={styles.ticketInfo}>
                  {item.ticket.date} {item.ticket.departure_time}
                </Text>
                <Text style={styles.ticketInfo}>
                  Jumlah: {item.quantity} @Rp
                  {item.price.toLocaleString("id-ID")}
                </Text>
              </View>
            ))}
          </View>

          {order.vouchers && (
            <View style={styles.voucherBox}>
              <Text style={styles.voucherText}>
                Voucher: {order.vouchers.code} ({order.vouchers.discount_type}{" "}
                {order.vouchers.discount_value})
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Total Bayar:</Text>
            <Text style={styles.total}>
              Rp {order.total_price.toLocaleString("id-ID")}
            </Text>
          </View>

          <View
            style={[
              styles.statusBox,
              {
                backgroundColor:
                  order.status === "PAID"
                    ? "#d1fae5"
                    : order.status === "CANCELLED"
                    ? "#fee2e2"
                    : "#fef9c3",
              },
            ]}
          >
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  const styles = StyleSheet.create({
    body: {
      padding: 14,
      fontSize: 10,
      backgroundColor: "#f0f6ff",
      fontFamily: "Helvetica",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 12,
      border: "1 solid #e0e7ff",
      boxShadow: "0 2px 8px #e0e7ff30",
    },
    title: {
      fontSize: 14,
      color: "#2563eb",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 11,
      color: "#2563eb",
      fontWeight: "bold",
      marginBottom: 3,
    },
    section: {
      marginVertical: 8,
      borderTop: "1 solid #e0e7ff",
      paddingTop: 6,
    },
    ticketItem: {
      marginBottom: 4,
      paddingBottom: 4,
      borderBottom: "1 dashed #e0e7ff",
    },
    route: {
      fontWeight: "bold",
      fontSize: 11,
      color: "#2563eb",
    },
    ticketInfo: {
      fontSize: 10,
      color: "#374151",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    label: {
      color: "#64748b",
      fontWeight: "normal",
    },
    value: {
      color: "#2563eb",
      fontWeight: "bold",
    },
    total: {
      color: "#2563eb",
      fontWeight: "bold",
      fontSize: 12,
    },
    statusBox: {
      marginTop: 8,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 8,
      alignSelf: "flex-end",
    },
    statusText: {
      fontSize: 10,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    voucherBox: {
      marginVertical: 6,
      backgroundColor: "#e0f2fe",
      borderRadius: 8,
      padding: 4,
      alignSelf: "flex-start",
    },
    voucherText: {
      color: "#0369a1",
      fontSize: 10,
      fontWeight: "bold",
    },
  });

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-2">
      <div className="mx-auto px-12">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center flex items-center gap-2 justify-center">
          <span className="bg-blue-100 rounded-full p-2 text-2xl">🧾</span>
          Riwayat Order Tiket
        </h2>
        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-center font-medium">
            {error}
          </div>
        )}
        <div className="grid gap-6">
          {orders.length === 0 && (
            <div className="text-gray-400 text-center py-16 text-lg">
              Tidak ada order tiket.
            </div>
          )}
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-md border border-blue-100 p-5 flex flex-col gap-3"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <div className="flex flex-col md:flex-row gap-2 items-center">
                  <span className="text-gray-500 font-medium">Order ID:</span>
                  <span className="font-bold text-blue-700">{order.id}</span>
                  <span className="hidden md:inline text-gray-400 mx-2">•</span>
                  <span className="text-gray-500 font-medium">Tanggal:</span>
                  <span className="font-semibold">
                    {order.order_date?.slice(0, 10)}
                  </span>
                </div>
                <span
                  className={
                    "inline-block px-3 py-1 rounded-xl text-xs font-bold " +
                    (order.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : order.status === "CANCELLED"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-700")
                  }
                >
                  {order.status}
                </span>
              </div>
              <div className="border-t border-blue-50 mb-2"></div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <div className="text-gray-500 text-sm font-medium mb-1">
                    Detail Tiket
                  </div>
                  <div className="text-sm">
                    {order.order_items.map((item: any) => (
                      <div key={item.id} className="mb-2">
                        <span className="font-semibold text-blue-600">
                          {item.ticket.origin} &rarr; {item.ticket.destination}
                        </span>
                        <div>
                          {item.ticket.date} {item.ticket.departure_time}
                        </div>
                        <div>
                          Jumlah: {item.quantity} @
                          <span className="font-semibold">
                            Rp{item.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-500 font-medium">Voucher:</span>
                    {order.vouchers ? (
                      <span className="bg-blue-50 px-2 rounded text-blue-600 font-bold ml-1">
                        {order.vouchers.code} ({order.vouchers.discount_type}{" "}
                        {order.vouchers.discount_value})
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-500 font-medium">
                      Total Bayar:
                    </span>
                    <span className="text-lg font-bold text-blue-700 ml-1">
                      Rp {order.total_price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="mt-2">
                    <PDFDownloadLink
                      document={<TicketPDF order={order} />}
                      fileName={`tiket_${order.id}.pdf`}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow font-medium text-sm transition"
                    >
                      Download PDF
                    </PDFDownloadLink>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
