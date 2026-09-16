"use client";
import { useMemo, useState } from "react";
import CustomersTable from "./CustomersTable";
import { OrdersPagination, CustomersPanelHeader, CustomersFilters } from "@/index";
import { mockCustomers, mockCustomersTotalCount, customerSegments, customerStatuses} from "./MockCustomers";

export default function CustomersPanel() {
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState(customerSegments[0]);
  const [status, setStatus] = useState(customerStatuses[0]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return mockCustomers.filter((customer) => {
      const matchesSegment = segment === customerSegments[0] || customer.segment === segment;
      const matchesStatus = status === customerStatuses[0] || customer.status === status;
      const matchesSearch =
        query === "" ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query);

      return matchesSegment && matchesStatus && matchesSearch;
    });
  }, [search, segment, status]);

  const pagedCustomers = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredCustomers.slice(startIndex, startIndex + pageSize);
  }, [filteredCustomers, page, pageSize]);

  const isFiltering = search.trim() !== "" || segment !== customerSegments[0] || status !== customerStatuses[0];
  const totalCount = isFiltering ? filteredCustomers.length : mockCustomersTotalCount;

  function withResetPage(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
      <CustomersPanelHeader searchValue={search} onSearchChange={withResetPage(setSearch)} />

      <div className="mt-4">
        <CustomersFilters
          segment={segment}
          onSegmentChange={withResetPage(setSegment)}
          segments={customerSegments}
          status={status}
          onStatusChange={withResetPage(setStatus)}
          statuses={customerStatuses}
        />
      </div>

      <div className="mt-4">
        <CustomersTable customers={pagedCustomers} />
      </div>

      <div className="mt-2">
        <OrdersPagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
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