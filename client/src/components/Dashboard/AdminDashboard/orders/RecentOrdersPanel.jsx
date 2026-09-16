"use client";
import { useMemo, useState } from "react";
import {OrdersPanelHeader, OrdersFilters, OrdersTable, OrdersPagination} from "@/index";
import { mockOrders, orderStatuses, paymentGateways } from "./MockOrders";

export default function RecentOrdersPanel() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(orderStatuses[0]);
  const [gateway, setGateway] = useState(paymentGateways[0]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return mockOrders.filter((order) => {
      const matchesStatus = status === orderStatuses[0] || order.status === status;
      const matchesGateway = gateway === paymentGateways[0] || order.gateway === gateway;
      const matchesSearch =
        query === "" ||
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.phone.toLowerCase().includes(query);

      return matchesStatus && matchesGateway && matchesSearch;
    });
  }, [search, status, gateway]);

  const pagedOrders = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredOrders, page, pageSize]);

  const withResetPage = (setter) => {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <OrdersPanelHeader searchValue={search} onSearchChange={withResetPage(setSearch)} />

      <div className="mt-4">
        <OrdersFilters
          status={status}
          onStatusChange={withResetPage(setStatus)}
          statuses={orderStatuses}
          gateway={gateway}
          onGatewayChange={withResetPage(setGateway)}
          gateways={paymentGateways}
        />
      </div>

      <div className="mt-4">
        <OrdersTable orders={pagedOrders} />
      </div>

      <div className="mt-2">
        <OrdersPagination
          page={page}
          pageSize={pageSize}
          totalCount={filteredOrders.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>
    </section>
  );
}