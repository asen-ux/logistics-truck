import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const A = '/assets/';

type IconProps = { name: string; size?: number; className?: string };
function Icon({ name, size = 16, className = '' }: IconProps) {
  return <img className={`icon ${className}`} src={`${A}${name}`} width={size} height={size} alt="" aria-hidden="true" />;
}

const mainGroups = [
  { label: '', items: [{ label: 'Dashboard', icon: 'frame8.svg' }] },
  {
    label: 'Project Mgmt.',
    items: [
      { label: 'Project', icon: 'frame9.svg' },
      { label: 'Customer Schedule', icon: 'nav-file.svg' },
      { label: 'Packing Slip', icon: 'nav-folder.svg' },
    ],
  },
  {
    label: 'Shipment Mgmt.',
    items: [
      { label: 'Shipment', icon: 'nav-stack.svg' },
      { label: 'Container', icon: 'nav-ship.svg' },
      { label: 'Truck', icon: 'nav-truck.svg' },
    ],
  },
  {
    label: 'Master Data',
    items: [
      { label: 'Invoices', icon: 'frame10.svg' },
      { label: 'Entities', icon: 'nav-db.svg' },
    ],
  },
];

const subNav = [
  ['Project Info', ''],
  ['Schedule', '2'],
  ['Packing Slip', '2'],
  ['Shipment', '6'],
  ['Container', '2'],
  ['Truck', '5'],
  ['Task', '12'],
];

const transportRows = [
  ['2025-10-30', 'xxx', 'xxx', 'xxx'],
  ['2025-10-25', 'xxx', 'xxx', 'xxx'],
  ['2025-10-20', 'xxx', 'xxx', 'xxx'],
  ['2025-10-18', 'xxx', 'xxx', 'xxx'],
];

function Header({ dark, onTheme }: { dark: boolean; onTheme: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand" aria-label="Voltage Logistic">
          <Icon name="logo-mark.svg" size={32} />
          <Icon name="logo-word.svg" className="brand-word" />
        </div>
        <div className="welcome">
          <Icon name="welcome.png" size={28} />
          <span>Welcome back , Brad Frost</span>
        </div>
      </div>
      <div className="account-actions">
        <button className="icon-button" onClick={onTheme} aria-label="Toggle color theme" aria-pressed={dark} title="Toggle color theme">
          <Icon name="theme.svg" size={16} />
        </button>
        <div className="profile-wrap">
          <button className="profile-button" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen}>
            <img src={`${A}avatar.png`} className="avatar" alt="Brad Frost" />
            <span>Brad Frost</span>
            <Icon name="chevron.svg" size={20} />
          </button>
          {menuOpen && (
            <div className="profile-menu" role="menu">
              <button role="menuitem">Profile</button>
              <button role="menuitem">Preferences</button>
              <button role="menuitem">Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MainNav({ collapsed, onToggle, onNotify }: { collapsed: boolean; onToggle: () => void; onNotify: (message: string) => void }) {
  return (
    <aside className={`main-nav ${collapsed ? 'is-collapsed' : ''}`} aria-label="Primary navigation">
      <nav>
        {mainGroups.map((group, groupIndex) => (
          <div className="nav-group" key={`${group.label}-${groupIndex}`}>
            {group.label && <div className="nav-caption">{group.label}</div>}
            {group.items.map((item) => {
              const active = item.label === 'Project';
              return (
                <button
                  key={item.label}
                  className={`nav-item ${active ? 'is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => !active && onNotify(`${item.label} is not part of this prototype.`)}
                  title={item.label}
                >
                  <Icon name={item.icon} size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <button
        className="collapse-nav"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        aria-expanded={!collapsed}
        title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
      >{collapsed ? '⇥' : '⇤'}</button>
    </aside>
  );
}

function ProjectBar() {
  return (
    <div className="projectbar">
      <Icon name="back.svg" size={24} />
      <strong>Project Name</strong>
      <span>PO-US-25.00434</span>
      <div className="partners" aria-label="LYNX and IBEX">
        <Icon name="lynx.svg" />
        <span>&amp;</span>
        <Icon name="ibex.svg" />
      </div>
    </div>
  );
}

function SubNav({ onNotify, truckCount }: { onNotify: (message: string) => void; truckCount: number }) {
  return (
    <aside className="sub-nav" aria-label="Project navigation">
      {subNav.map(([name, count], index) => {
        const displayCount = name === 'Truck' ? String(truckCount) : count;
        return (
          <button
            key={name}
            className={`sub-item ${name === 'Truck' ? 'is-active' : ''} ${index === subNav.length - 1 ? 'separated' : ''}`}
            onClick={() => name !== 'Truck' && onNotify(`${name} is not part of this prototype.`)}
          >
            <span>{name}</span>
            {displayCount && <span className="count">{displayCount}</span>}
          </button>
        );
      })}
    </aside>
  );
}

function SectionHeader({
  id,
  title,
  collapsed,
  onToggle,
  onEdit,
}: {
  id: string;
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="section-heading" id={id}>
      <button className="section-title" onClick={onToggle} aria-expanded={!collapsed}>
        <span className="section-accent" />
        <strong>{title}</strong>
      </button>
      <button className="edit-button" onClick={onEdit} aria-label={`Edit ${title}`} title={`Edit ${title}`}>
        <Icon name="vector8.svg" size={16} />
      </button>
    </div>
  );
}

function DataTable({ headers, rows, className = '' }: { headers: string[]; rows: string[][]; className?: string }) {
  return (
    <div className={`table-wrap ${className}`}>
      <table>
        <thead>
          <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>{row.map((cell, c) => <td key={`${r}-${c}`}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Field({ label, children, action }: { label: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="field">
      <div className="field-label">{label}{action}</div>
      <div className="field-value">{children}</div>
    </div>
  );
}

type SapState = 'idle' | 'syncing' | 'success' | 'error';
type DashboardRow = {
  id: number;
  page: number;
  carrierRef: string;
  shipment: string;
  container: string;
  deliveryType: string;
  otr: string;
  carrier: string;
  eta: string;
  ata: string;
  sap: SapState;
  pallet: string;
  packageItem: string;
  blockNo: string;
  cbxNo: string;
  packageNo: string;
  packages: string;
  grossWeight: string;
  price: string;
  sapDeliveryNo: string;
  from: string;
  to: string;
  mileage: string;
  driverName: string;
  licensePlate: string;
  driverPhone: string;
  etd: string;
  atd: string;
};

function BaseInfo({ collapsed, record }: { collapsed: boolean; record: DashboardRow }) {
  if (collapsed) return null;
  const packageRows = Array.from({ length: 4 }, () => [
    record.pallet,
    record.packageItem,
    record.blockNo,
    record.cbxNo,
    record.packageNo,
    record.packages,
    record.grossWeight,
    record.price,
  ]);
  return (
    <div className="section-content base-content">
      <div className="two-fields">
        <Field label="Container No.">
          <span className="link-like">{record.container}</span>
        </Field>
        <Field label="Pallet">{record.pallet}</Field>
      </div>
      <h3>Package List</h3>
      <DataTable
        headers={['Pallet', 'Item description', 'Block No.', 'CBX No.', 'Package No.', 'Packages', 'Gross weight (kg)', 'Price（$）']}
        rows={packageRows}
      />
      <div className="base-meta">
        <Field label="Loading List">
          <span className="file-row">{record.carrierRef}-{record.shipment}-PackingSlip.pdf <Icon name="vector9.svg" /> <Icon name="vector10.svg" /></span>
        </Field>
        <Field label="SAP Delivery  #">{record.sapDeliveryNo}</Field>
        <Field label="SAP Delivery" action={<button className="text-link">Cancel</button>}>
          {record.sap === 'success' && <span className="success-badge"><Icon name="check.svg" /> SAP synchronization successful.</span>}
          {record.sap === 'error' && <span className="sap-status error"><Icon name="frame7.svg" size={12} /> Item Code: 24316AP needs retry.</span>}
          {record.sap === 'syncing' && <span className="sap-syncing"><span className="mini-spinner" /> Synchronizing…</span>}
          {record.sap === 'idle' && <span className="pending-badge">Pending synchronization</span>}
        </Field>
        <Field label="Delivery Date">{record.ata}</Field>
        <Field label="Posting Date">{record.eta}</Field>
      </div>
    </div>
  );
}

function Cost({ collapsed }: { collapsed: boolean }) {
  if (collapsed) return null;
  return (
    <div className="section-content cost-content">
      <h3>Auto Alocation</h3>
      <DataTable
        headers={['Auto Alocation Type', 'OTR Costs', 'Costs Details', 'Total']}
        rows={[[
          'By Quontity',
          '$ 50,000.00',
          '$ 100,000.00 Chassis\n$ 50,000.00 Transloading Costs\n$ 50,000.00 Demurrage',
          '$ 2,000,000.00',
        ]]}
        className="cost-table"
      />
      <h3>Manual Alocation</h3>
      <DataTable
        headers={['PO-Shipment', 'OTR Costs', 'Costs Details', 'Total']}
        rows={[
          ['PO-US-25,00394-1st', '$ 50,000.00', '$ 100,000.00 Chassis\n$ 50,000.00 Transloading Costs\n$ 50,000.00 Demurrage', '$ 2,000,000.00'],
          ['PO-US-25,00394-2st', '$ 50,000.00', '', '$ 50,000.00'],
        ]}
        className="cost-table"
      />
    </div>
  );
}

function Carrier({ collapsed, record }: { collapsed: boolean; record: DashboardRow }) {
  if (collapsed) return null;
  return (
    <div className="section-content carrier-content">
      <div className="three-fields">
        <Field label="OTR">{record.otr}</Field>
        <Field label="US OTR Carrier">{record.carrier}</Field>
        <Field label="Carrier Ref No." action={<button className="text-link">Merge</button>}>{record.carrierRef}</Field>
        <Field label="From">{record.from}</Field>
        <Field label="To">{record.to}</Field>
        <Field label="Mileage（m）">{record.mileage}</Field>
        <Field label="Driver Name">{record.driverName}</Field>
        <Field label="License Plate">{record.licensePlate}</Field>
        <Field label="Driver Phone">{record.driverPhone}</Field>
      </div>
      <div className="table-title-row">
        <h3>Transportation Log</h3>
        <button className="text-link"><Icon name="frame4.svg" /> Map</button>
      </div>
      <DataTable headers={['Date/Time', 'Loacation', 'Notes', 'Miles to Delivery']} rows={transportRows} />
    </div>
  );
}

function Delivered({ collapsed, record }: { collapsed: boolean; record: DashboardRow }) {
  if (collapsed) return null;
  return (
    <div className="section-content delivered-content">
      <Field label="Deliver Type">{record.deliveryType}</Field>
      <div className="delivery-columns">
        <div>
          <Field label="Truck Departure">
            <span className="date-line"><Icon name="frame5.svg" /> ETD Truck：{record.etd}</span>
            <span className="date-line"><Icon name="frame6.svg" /> ATD Truck：{record.atd}</span>
          </Field>
          <Field label="Remarks">-</Field>
          <Field label="POD File">-</Field>
        </div>
        <div>
          <Field label="Job Site Arrival">
            <span className="date-line"><Icon name="frame5.svg" /> ETA Job Site for Customer： <span className="alert-date"><Icon name="frame7.svg" />{record.eta}</span></span>
            <span className="date-line"><Icon name="frame6.svg" /> ATA Job Site：{record.ata}</span>
          </Field>
          <Field label="Remarks">-</Field>
          <Field label="POD Received Date">-</Field>
        </div>
      </div>
    </div>
  );
}

const sectionNames = ['Basic Info', 'Cost', 'Carrier', 'Delivered'] as const;
type SectionName = (typeof sectionNames)[number];

const baseDashboardRows: DashboardRow[] = [
  {
    id: 1, page: 1, carrierRef: '38027691', shipment: 'Golden Row', container: 'SMCU1102456', deliveryType: 'Port → Job site', otr: 'Hotshot', carrier: 'Total Quality Logistics', eta: '2026-05-22', ata: '2026-08-22', sap: 'idle',
    pallet: 'Pallet 1', packageItem: 'LYNX', blockNo: 'INV105', cbxNo: 'LBD15', packageNo: 'Reel', packages: '1', grossWeight: '1100.28', price: '2200.11', sapDeliveryNo: 'SAP-38027691',
    from: 'Port of Houston', to: 'Austin Job Site', mileage: '164', driverName: 'Michael Reed', licensePlate: 'TX-8LJ291', driverPhone: '+1 713 555 0184', etd: '2026-05-20', atd: '2026-05-20',
  },
  {
    id: 2, page: 1, carrierRef: '38027692', shipment: 'Golden Row', container: 'SMCU1102457', deliveryType: 'Port → Job site', otr: 'Hotshot', carrier: 'Total Quality Logistics', eta: '2026-05-22', ata: '2026-08-22', sap: 'error',
    pallet: 'Pallet 2', packageItem: 'IBEX', blockNo: 'INV106', cbxNo: 'LBD16', packageNo: 'Crate', packages: '2', grossWeight: '980.42', price: '1960.84', sapDeliveryNo: 'SAP-38027692',
    from: 'Port of Houston', to: 'Austin Job Site', mileage: '164', driverName: 'Sarah Collins', licensePlate: 'TX-2QK804', driverPhone: '+1 832 555 0147', etd: '2026-05-20', atd: '2026-05-21',
  },
  {
    id: 3, page: 1, carrierRef: '38027693', shipment: '1st', container: 'CMAU8838932', deliveryType: 'Port → Warehouse', otr: 'Flatbed', carrier: 'J.B. Hunt Transport', eta: '2026-06-03', ata: '2026-06-05', sap: 'success',
    pallet: 'Pallet 3', packageItem: 'LYNX', blockNo: 'INV107', cbxNo: 'LBD21', packageNo: 'Reel', packages: '1', grossWeight: '1244.80', price: '2489.60', sapDeliveryNo: 'SAP-38027693',
    from: 'Port of Long Beach', to: 'Phoenix Warehouse', mileage: '374', driverName: 'Daniel Kim', licensePlate: 'CA-6NR117', driverPhone: '+1 562 555 0118', etd: '2026-06-01', atd: '2026-06-01',
  },
  {
    id: 4, page: 1, carrierRef: '38027694', shipment: '1st', container: 'TGHU7811004', deliveryType: 'Warehouse → Job site', otr: 'Dry Van', carrier: 'Schneider National', eta: '2026-06-18', ata: '2026-06-19', sap: 'idle',
    pallet: 'Pallet 4', packageItem: 'IBEX', blockNo: 'INV108', cbxNo: 'LBD22', packageNo: 'Box', packages: '4', grossWeight: '760.16', price: '1520.32', sapDeliveryNo: 'SAP-38027694',
    from: 'Dallas Warehouse', to: 'Tulsa Job Site', mileage: '258', driverName: 'Olivia Brooks', licensePlate: 'TX-4HU630', driverPhone: '+1 214 555 0192', etd: '2026-06-17', atd: '2026-06-17',
  },
  {
    id: 5, page: 1, carrierRef: '38027695', shipment: '2nd', container: 'MEDU7421803', deliveryType: 'Port → Job site', otr: 'Hotshot', carrier: 'Total Quality Logistics', eta: '2026-07-09', ata: '2026-07-10', sap: 'success',
    pallet: 'Pallet 5', packageItem: 'LYNX', blockNo: 'INV109', cbxNo: 'LBD23', packageNo: 'Crate', packages: '2', grossWeight: '1320.64', price: '2641.28', sapDeliveryNo: 'SAP-38027695',
    from: 'Port of Savannah', to: 'Atlanta Job Site', mileage: '248', driverName: 'James Walker', licensePlate: 'GA-9ME425', driverPhone: '+1 912 555 0163', etd: '2026-07-07', atd: '2026-07-07',
  },
  {
    id: 6, page: 1, carrierRef: '38027696', shipment: '2nd', container: 'MSCU6409821', deliveryType: 'Port → Job site', otr: 'Flatbed', carrier: 'J.B. Hunt Transport', eta: '2026-07-16', ata: '2026-07-17', sap: 'idle',
    pallet: 'Pallet 6', packageItem: 'IBEX', blockNo: 'INV110', cbxNo: 'LBD24', packageNo: 'Reel', packages: '1', grossWeight: '1188.35', price: '2376.70', sapDeliveryNo: 'SAP-38027696',
    from: 'Port of Newark', to: 'Albany Job Site', mileage: '151', driverName: 'Emily Carter', licensePlate: 'NJ-7WX318', driverPhone: '+1 973 555 0129', etd: '2026-07-14', atd: '2026-07-15',
  },
  {
    id: 7, page: 1, carrierRef: '38027697', shipment: '3rd', container: 'OOLU9281740', deliveryType: 'Warehouse → Job site', otr: 'Dry Van', carrier: 'Schneider National', eta: '2026-08-04', ata: '2026-08-05', sap: 'success',
    pallet: 'Pallet 7', packageItem: 'LYNX', blockNo: 'INV111', cbxNo: 'LBD25', packageNo: 'Box', packages: '3', grossWeight: '905.72', price: '1811.44', sapDeliveryNo: 'SAP-38027697',
    from: 'Chicago Warehouse', to: 'Detroit Job Site', mileage: '283', driverName: 'Noah Bennett', licensePlate: 'IL-5DK208', driverPhone: '+1 312 555 0175', etd: '2026-08-02', atd: '2026-08-03',
  },
  {
    id: 8, page: 1, carrierRef: '38027698', shipment: '3rd', container: 'HLCU6113058', deliveryType: 'Port → Job site', otr: 'Hotshot', carrier: 'Total Quality Logistics', eta: '2026-08-11', ata: '2026-08-12', sap: 'idle',
    pallet: 'Pallet 8', packageItem: 'IBEX', blockNo: 'INV112', cbxNo: 'LBD26', packageNo: 'Crate', packages: '2', grossWeight: '1026.48', price: '2052.96', sapDeliveryNo: 'SAP-38027698',
    from: 'Port of Baltimore', to: 'Richmond Job Site', mileage: '150', driverName: 'Ava Mitchell', licensePlate: 'MD-3PV714', driverPhone: '+1 410 555 0136', etd: '2026-08-09', atd: '2026-08-10',
  },
];

const firstTabExtraDrivers = ['Ethan Parker', 'Mia Turner', 'Lucas Evans', 'Sophia Hill', 'Mason Scott', 'Isabella Green'];
const initialDashboardRows: DashboardRow[] = [
  ...baseDashboardRows.slice(0, 4),
  ...Array.from({ length: 6 }, (_, index): DashboardRow => {
    const carrierRef = String(38027699 + index);
    return {
      ...baseDashboardRows[2],
      id: 9 + index,
      carrierRef,
      shipment: '1st',
      container: `FSCU${5301200 + index * 7}`,
      eta: `2026-06-${String(6 + index).padStart(2, '0')}`,
      ata: `2026-06-${String(7 + index).padStart(2, '0')}`,
      pallet: `Pallet ${9 + index}`,
      blockNo: `INV${113 + index}`,
      cbxNo: `LBD${27 + index}`,
      grossWeight: String((1080.24 + index * 37.15).toFixed(2)),
      price: String((2160.48 + index * 74.3).toFixed(2)),
      sapDeliveryNo: `SAP-${carrierRef}`,
      driverName: firstTabExtraDrivers[index],
      licensePlate: `TX-${3 + index}RF${210 + index}`,
      driverPhone: `+1 469 555 01${String(30 + index)}`,
      etd: `2026-06-${String(4 + index).padStart(2, '0')}`,
      atd: `2026-06-${String(5 + index).padStart(2, '0')}`,
      sap: index % 3 === 0 ? 'success' : 'idle',
    };
  }),
  ...baseDashboardRows.slice(4),
];

function Dropdown({ value, options, onChange, ariaLabel, className = '' }: {
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function openMenu() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(Math.max(rect.width, 180), window.innerWidth - 16);
    const estimatedHeight = options.length * 38 + 8;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    const top = rect.bottom + 6 + estimatedHeight <= window.innerHeight
      ? rect.bottom + 6
      : Math.max(8, rect.top - estimatedHeight - 6);
    setPosition({ top, left, width });
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };
    const closeMenu = () => setOpen(false);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', closeOnOutside);
    window.addEventListener('resize', closeMenu);
    window.addEventListener('scroll', closeMenu, true);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside);
      window.removeEventListener('resize', closeMenu);
      window.removeEventListener('scroll', closeMenu, true);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const selected = options.find((option) => option.value === value);
  return (
    <div className="custom-dropdown">
      <button
        ref={triggerRef}
        type="button"
        className={`custom-dropdown-trigger ${className}`}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => open ? setOpen(false) : openMenu()}
      >
        <span>{selected?.label ?? value}</span>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6.5 8 3.5 3.5L13.5 8" /></svg>
      </button>
      {open && createPortal(
        <div ref={menuRef} className="custom-dropdown-menu" role="listbox" aria-label={ariaLabel} style={position}>
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={option.value === value ? 'is-selected' : ''}
              key={option.value || 'all'}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
                triggerRef.current?.focus();
              }}
            >
              <span>{option.label}</span>
              {option.value === value && <span className="dropdown-check">✓</span>}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}

function DashboardTable({ rows, page, totalPages, searchDraft, shipmentFilter, otrFilter, onSearchDraftChange, onSearch, onShipmentFilter, onOtrFilter, onPage, onChange, onOpenRecord, onOpenContainer, onDelete, onSubmit }: {
  rows: DashboardRow[];
  page: number;
  totalPages: number;
  searchDraft: string;
  shipmentFilter: string;
  otrFilter: string;
  onSearchDraftChange: (value: string) => void;
  onSearch: () => void;
  onShipmentFilter: (value: string) => void;
  onOtrFilter: (value: string) => void;
  onPage: (page: number) => void;
  onChange: (id: number, field: keyof DashboardRow, value: string) => void;
  onOpenRecord: (row: DashboardRow) => void;
  onOpenContainer: (row: DashboardRow) => void;
  onDelete: (row: DashboardRow) => void;
  onSubmit: (row: DashboardRow) => void;
}) {
  return (
    <div className="dashboard-panel">
      <form className="dashboard-controls" aria-label="Dashboard search and filters" onSubmit={(event) => { event.preventDefault(); onSearch(); }}>
        <div className="dashboard-search-group">
          <input
            className="dashboard-search"
            type="search"
            value={searchDraft}
            onChange={(event) => onSearchDraftChange(event.target.value)}
            placeholder="Search Carrier Ref No."
            aria-label="Search Carrier Ref No."
          />
          <button className="dashboard-search-button" type="submit" aria-label="Search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" />
            </svg>
          </button>
        </div>
        <div className="dashboard-filter-group">
          <Dropdown
            className="dashboard-filter"
            value={shipmentFilter}
            onChange={onShipmentFilter}
            ariaLabel="Filter by shipment"
            options={[
              { value: '', label: 'All Shipments' },
              { value: 'Golden Row', label: 'Golden Row' },
              { value: '1st', label: '1st' },
              { value: '2nd', label: '2nd' },
              { value: '3rd', label: '3rd' },
            ]}
          />
          <Dropdown
            className="dashboard-filter"
            value={otrFilter}
            onChange={onOtrFilter}
            ariaLabel="Filter by OTR"
            options={[
              { value: '', label: 'All OTR Types' },
              { value: 'Hotshot', label: 'Hotshot' },
              { value: 'Flatbed', label: 'Flatbed' },
              { value: 'Dry Van', label: 'Dry Van' },
            ]}
          />
        </div>
      </form>
      <div className="dashboard-table-wrap">
        <table className="dashboard-table">
          <thead><tr>
            <th>Carrier Ref No.</th><th>Shipment</th><th>Container</th><th>Deliver Type</th><th>OTR</th><th>US OTR Carrier</th><th>ETA Job site for customer</th><th>ATA Job Site</th><th>SAP Delivery</th><th className="dashboard-action-column">Action</th>
          </tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td><button className="dashboard-link carrier-ref-link" onClick={() => onOpenRecord(row)} aria-label={`Open carrier reference ${row.carrierRef} in ${row.shipment} tab`}>{row.carrierRef}</button></td>
                <td>{row.shipment}</td>
                <td><button className="dashboard-link" onClick={() => onOpenContainer(row)} aria-label={`Open container ${row.container}`}>{row.container}</button></td>
                <td><Dropdown className="table-dropdown-trigger" value={row.deliveryType} onChange={(value) => onChange(row.id, 'deliveryType', value)} ariaLabel={`Delivery type for ${row.carrierRef}`} options={[{ value: 'Port → Job site', label: 'Port → Job site' }, { value: 'Warehouse → Job site', label: 'Warehouse → Job site' }, { value: 'Port → Warehouse', label: 'Port → Warehouse' }]} /></td>
                <td><Dropdown className="table-dropdown-trigger" value={row.otr} onChange={(value) => onChange(row.id, 'otr', value)} ariaLabel={`OTR for ${row.carrierRef}`} options={[{ value: 'Hotshot', label: 'Hotshot' }, { value: 'Flatbed', label: 'Flatbed' }, { value: 'Dry Van', label: 'Dry Van' }]} /></td>
                <td><Dropdown className="table-dropdown-trigger" value={row.carrier} onChange={(value) => onChange(row.id, 'carrier', value)} ariaLabel={`Carrier for ${row.carrierRef}`} options={[{ value: 'Total Quality Logistics', label: 'Total Quality Logistics' }, { value: 'J.B. Hunt Transport', label: 'J.B. Hunt Transport' }, { value: 'Schneider National', label: 'Schneider National' }]} /></td>
                <td><input type="date" value={row.eta} onClick={(event) => event.currentTarget.showPicker()} onChange={(event) => onChange(row.id, 'eta', event.target.value)} aria-label={`ETA for ${row.carrierRef}`} /></td>
                <td><input type="date" value={row.ata} onClick={(event) => event.currentTarget.showPicker()} onChange={(event) => onChange(row.id, 'ata', event.target.value)} aria-label={`ATA for ${row.carrierRef}`} /></td>
                <td>
                  {row.sap === 'idle' && <div className="inline-actions"><button type="button">View</button><button onClick={() => onSubmit(row)}>Submit</button></div>}
                  {row.sap === 'syncing' && <span className="sap-syncing"><span className="mini-spinner" /> Synchronizing…</span>}
                  {row.sap === 'success' && <span className="sap-status success"><Icon name="check.svg" size={12} /> SAP synchronization successful.</span>}
                  {row.sap === 'error' && <span className="sap-status success"><Icon name="check.svg" size={12} /> SAP synchronization successful.</span>}
                </td>
                <td className="dashboard-action-column"><div className="inline-actions"><button onClick={() => onOpenRecord(row)}>View</button><button onClick={() => onDelete(row)}>Delete</button></div></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td className="dashboard-empty" colSpan={10}>No truck records on this page.</td></tr>}
          </tbody>
        </table>
      </div>
      <nav className="pagination" aria-label="Dashboard pages">
        <button aria-label="Previous page" disabled={page === 1} onClick={() => onPage(page - 1)}><Icon name="vector5.svg" size={14} /></button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} className={page === number ? 'is-active' : ''} aria-current={page === number ? 'page' : undefined} onClick={() => onPage(number)}>{number}</button>)}
        <button aria-label="Next page" disabled={page === totalPages} onClick={() => onPage(page + 1)}><Icon name="vector7.svg" size={14} /></button>
      </nav>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [activeSection, setActiveSection] = useState<SectionName>('Basic Info');
  const [activeTruck, setActiveTruck] = useState(0);
  const [dashboardRows, setDashboardRows] = useState<DashboardRow[]>(initialDashboardRows);
  const [dashboardPage, setDashboardPage] = useState(1);
  const [searchDraft, setSearchDraft] = useState('');
  const [dashboardSearch, setDashboardSearch] = useState('');
  const [shipmentFilter, setShipmentFilter] = useState('');
  const [otrFilter, setOtrFilter] = useState('');
  const [viewingRow, setViewingRow] = useState<DashboardRow | null>(null);
  const [deletingRow, setDeletingRow] = useState<DashboardRow | null>(null);
  const [collapsed, setCollapsed] = useState<Record<SectionName, boolean>>({
    'Basic Info': false,
    Cost: false,
    Carrier: false,
    Delivered: false,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const notify = (message: string) => setToast(message);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.getAttribute('data-section') as SectionName);
      },
      { rootMargin: '-160px 0px -55% 0px', threshold: [0.05, 0.35] },
    );
    document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollToSection(name: SectionName) {
    setActiveSection(name);
    setCollapsed((state) => ({ ...state, [name]: false }));
    document.getElementById(name.toLowerCase().replace(' ', '-'))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function copyTruck() {
    const source = dashboardRows[activeTruck] ?? dashboardRows[dashboardRows.length - 1] ?? initialDashboardRows[0];
    const nextId = Math.max(0, ...dashboardRows.map((row) => row.id)) + 1;
    const copiedRecord = {
      ...source,
      id: nextId,
      page: activeTab === 'Dashboard' ? dashboardPage : source.page,
      carrierRef: String(38027800 + nextId),
      sapDeliveryNo: `SAP-${38027800 + nextId}`,
      sap: 'idle' as SapState,
    };
    setDashboardRows((rows) => [...rows, copiedRecord]);
    setActiveTruck(dashboardRows.length);
    notify('Truck copied successfully.');
  }

  function updateDashboardRow(id: number, field: keyof DashboardRow, value: string) {
    setDashboardRows((rows) => rows.map((row) => row.id === id ? { ...row, [field]: value } : row));
    const row = dashboardRows.find((item) => item.id === id);
    if (!row || row[field] === value) return;
    const messages: Partial<Record<keyof DashboardRow, string>> = {
      deliveryType: `Delivery type updated to “${value}”.`,
      otr: `OTR type updated to “${value}”.`,
      carrier: `US OTR carrier updated to “${value}”.`,
      eta: `ETA job site date updated to ${value}.`,
      ata: `ATA job site date updated to ${value}.`,
    };
    if (messages[field]) notify(messages[field]);
  }

  function submitSap(row: DashboardRow) {
    setDashboardRows((rows) => rows.map((item) => item.id === row.id ? { ...item, sap: 'syncing' } : item));
    window.setTimeout(() => {
      setDashboardRows((rows) => rows.map((item) => item.id === row.id ? { ...item, sap: 'success' } : item));
      notify(`SAP delivery ${row.carrierRef} synchronized.`);
    }, 850);
  }

  function confirmDeleteDashboardRow() {
    if (!deletingRow) return;
    const deletingIndex = dashboardRows.findIndex((row) => row.id === deletingRow.id);
    const remaining = dashboardRows.filter((row) => row.id !== deletingRow.id);
    let nextIndex = activeTruck;
    if (deletingIndex >= 0 && deletingIndex < activeTruck) nextIndex -= 1;
    if (deletingIndex === activeTruck) nextIndex = Math.min(deletingIndex, remaining.length - 1);
    nextIndex = Math.max(0, Math.min(nextIndex, remaining.length - 1));
    setDashboardRows(remaining);
    setActiveTruck(nextIndex);
    if (activeTab !== 'Dashboard' && remaining[nextIndex]) setActiveTab(remaining[nextIndex].shipment);
    notify(`Carrier reference ${deletingRow.carrierRef} was deleted.`);
    setDeletingRow(null);
  }

  function openCarrierRecord(row: DashboardRow) {
    const index = dashboardRows.findIndex((item) => item.id === row.id);
    if (index < 0) return;
    setActiveTruck(index);
    setActiveTab(row.shipment);
    setViewingRow(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectCarrierRecord(index: number) {
    const record = dashboardRows[index];
    if (!record) return;
    setActiveTruck(index);
    setActiveTab(record.shipment);
  }

  function changeTab(tab: string) {
    setActiveTab(tab);
    if (tab === 'Dashboard') return;
    const matchingIndex = tab === 'Golden Row'
      ? 0
      : dashboardRows.findIndex((row) => row.shipment === tab);
    if (matchingIndex >= 0) setActiveTruck(matchingIndex);
  }

  const currentRecord = dashboardRows[activeTruck] ?? dashboardRows[0] ?? initialDashboardRows[0];
  const activeTabRecords = dashboardRows.filter((row) => row.shipment === activeTab);
  const activeTabRecordPosition = Math.max(0, activeTabRecords.findIndex((row) => row.id === currentRecord.id));
  const truckWindowStart = Math.min(
    Math.max(0, activeTabRecordPosition - 4),
    Math.max(0, activeTabRecords.length - 5),
  );
  const normalizedSearch = dashboardSearch.trim().toLowerCase();
  const filteredDashboardRows = dashboardRows.filter((row) => {
    const matchesSearch = !normalizedSearch
      || row.carrierRef.toLowerCase().includes(normalizedSearch);
    const matchesShipment = !shipmentFilter || row.shipment === shipmentFilter;
    const matchesOtr = !otrFilter || row.otr === otrFilter;
    return matchesSearch && matchesShipment && matchesOtr;
  });
  const dashboardPageSize = 10;
  const dashboardTotalPages = Math.max(1, Math.ceil(filteredDashboardRows.length / dashboardPageSize));
  const currentDashboardPage = Math.min(dashboardPage, dashboardTotalPages);
  const visibleDashboardRows = filteredDashboardRows.slice(
    (currentDashboardPage - 1) * dashboardPageSize,
    currentDashboardPage * dashboardPageSize,
  );

  useEffect(() => {
    if (dashboardPage !== currentDashboardPage) setDashboardPage(currentDashboardPage);
  }, [dashboardPage, currentDashboardPage]);

  return (
    <div className={`app ${dark ? 'dark' : ''} ${navCollapsed ? 'nav-collapsed' : ''}`}>
      <Header dark={dark} onTheme={() => setDark((v) => !v)} />
      <MainNav collapsed={navCollapsed} onToggle={() => setNavCollapsed((value) => !value)} onNotify={notify} />
      <ProjectBar />
      <div className={`sticky-card-mask ${activeTab === 'Dashboard' ? 'dashboard-mask' : ''}`} aria-hidden="true" />
      <main className="workspace">
        <SubNav onNotify={notify} truckCount={dashboardRows.length} />
        <div className="content-column">
          <section className={`truck-card ${activeTab === 'Dashboard' ? 'dashboard-active' : ''}`}>
            <div className="truck-toolbar">
              <div className="truck-title"><Icon name="folder.png" size={20} /><h1>Truck</h1></div>
              <div className="toolbar-actions">
                <button type="button"><Icon name="add.svg" /> Add Truck</button>
                <button onClick={() => inputRef.current?.click()}><Icon name="upload.svg" /> Upload Truck</button>
                <button onClick={copyTruck}><Icon name="copy.svg" /> Copy Truck</button>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  hidden
                  onChange={(e) => e.target.files?.[0] && notify(`${e.target.files[0].name} uploaded.`)}
                />
              </div>
            </div>
            <div className="tabs" role="tablist" aria-label="Truck group">
              {['Dashboard', 'Golden Row', '1st', '2nd', '3rd'].map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={activeTab === tab ? 'is-active' : ''}
                  onClick={() => changeTab(tab)}
                >{tab}</button>
              ))}
            </div>
            {activeTab === 'Dashboard' ? (
              <DashboardTable
                rows={visibleDashboardRows}
                page={currentDashboardPage}
                totalPages={dashboardTotalPages}
                searchDraft={searchDraft}
                shipmentFilter={shipmentFilter}
                otrFilter={otrFilter}
                onSearchDraftChange={(value) => {
                  setSearchDraft(value);
                  if (!value.trim()) {
                    setDashboardSearch('');
                    setDashboardPage(1);
                  }
                }}
                onSearch={() => {
                  setDashboardSearch(searchDraft);
                  setDashboardPage(1);
                }}
                onShipmentFilter={(value) => {
                  setShipmentFilter(value);
                  setDashboardPage(1);
                }}
                onOtrFilter={(value) => {
                  setOtrFilter(value);
                  setDashboardPage(1);
                }}
                onPage={(page) => setDashboardPage(Math.max(1, Math.min(dashboardTotalPages, page)))}
                onChange={updateDashboardRow}
                onOpenRecord={openCarrierRecord}
                onOpenContainer={(row) => notify(`Redirecting to container ${row.container}.`)}
                onDelete={setDeletingRow}
                onSubmit={submitSap}
              />
            ) : <div className="details-layout">
              <div className="details-main">
                <div className="truck-selector">
                  {activeTabRecords.length > 5 && (
                    <button
                      className="selector-arrow"
                      disabled={activeTabRecordPosition === 0}
                      onClick={() => {
                        const previous = activeTabRecords[Math.max(0, activeTabRecordPosition - 1)];
                        selectCarrierRecord(dashboardRows.findIndex((row) => row.id === previous.id));
                      }}
                      aria-label="Previous truck"
                    ><Icon name="vector5.svg" /></button>
                  )}
                  <div className="truck-options" role="listbox" aria-label="Trucks">
                    {activeTabRecords.slice(truckWindowStart, truckWindowStart + 5).map((record) => {
                      const index = dashboardRows.findIndex((row) => row.id === record.id);
                      return (
                      <button
                        role="option"
                        aria-selected={activeTruck === index}
                        className={activeTruck === index ? 'is-active' : ''}
                        key={record.id}
                        onClick={() => selectCarrierRecord(index)}
                        aria-label={`Carrier reference ${record.carrierRef}, shipment ${record.shipment}`}
                      >
                        <Icon name="truck.png" size={20} />
                        <span>{record.carrierRef}</span>
                        {activeTruck === index && <span className="delete-truck" onClick={(e) => { e.stopPropagation(); setDeletingRow(record); }}><Icon name="vector6.svg" /></span>}
                      </button>
                    );})}
                  </div>
                  {activeTabRecords.length > 5 && (
                    <button
                      className="selector-arrow"
                      disabled={activeTabRecordPosition >= activeTabRecords.length - 1}
                      onClick={() => {
                        const next = activeTabRecords[Math.min(activeTabRecords.length - 1, activeTabRecordPosition + 1)];
                        selectCarrierRecord(dashboardRows.findIndex((row) => row.id === next.id));
                      }}
                      aria-label="Next truck"
                    ><Icon name="vector7.svg" /></button>
                  )}
                </div>

                <section data-section="Basic Info">
                  <SectionHeader id="basic-info" title="Base Info" collapsed={collapsed['Basic Info']} onToggle={() => setCollapsed((s) => ({ ...s, 'Basic Info': !s['Basic Info'] }))} onEdit={() => notify('Basic Info edit mode opened.')} />
                  <BaseInfo collapsed={collapsed['Basic Info']} record={currentRecord} />
                </section>
                <section data-section="Cost">
                  <SectionHeader id="cost" title="Cost" collapsed={collapsed.Cost} onToggle={() => setCollapsed((s) => ({ ...s, Cost: !s.Cost }))} onEdit={() => notify('Cost edit mode opened.')} />
                  <Cost collapsed={collapsed.Cost} />
                </section>
                <section data-section="Carrier">
                  <SectionHeader id="carrier" title="Carrier" collapsed={collapsed.Carrier} onToggle={() => setCollapsed((s) => ({ ...s, Carrier: !s.Carrier }))} onEdit={() => notify('Carrier edit mode opened.')} />
                  <Carrier collapsed={collapsed.Carrier} record={currentRecord} />
                </section>
                <section data-section="Delivered">
                  <SectionHeader id="delivered" title="Delivered" collapsed={collapsed.Delivered} onToggle={() => setCollapsed((s) => ({ ...s, Delivered: !s.Delivered }))} onEdit={() => notify('Delivered edit mode opened.')} />
                  <Delivered collapsed={collapsed.Delivered} record={currentRecord} />
                </section>
              </div>
              <nav className="anchor-nav" aria-label="Page sections">
                {sectionNames.map((name) => (
                  <button className={activeSection === name ? 'is-active' : ''} key={name} onClick={() => scrollToSection(name)}>{name}</button>
                ))}
              </nav>
            </div>}
          </section>
        </div>
      </main>
      {viewingRow && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setViewingRow(null)}>
          <section className="record-modal" role="dialog" aria-modal="true" aria-labelledby="record-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <div><span className="modal-eyebrow">Carrier reference</span><h2 id="record-title">{viewingRow.carrierRef}</h2></div>
              <button onClick={() => setViewingRow(null)}>Close</button>
            </div>
            <div className="record-grid">
              <Field label="Shipment">{viewingRow.shipment}</Field>
              <Field label="Container"><span className="link-like">{viewingRow.container}</span></Field>
              <Field label="Deliver Type">{viewingRow.deliveryType}</Field>
              <Field label="OTR">{viewingRow.otr}</Field>
              <Field label="US OTR Carrier">{viewingRow.carrier}</Field>
              <Field label="ETA Job site">{viewingRow.eta}</Field>
              <Field label="ATA Job site">{viewingRow.ata}</Field>
              <Field label="SAP Delivery">{viewingRow.sap === 'success' ? 'Synchronized' : 'Pending'}</Field>
            </div>
          </section>
        </div>
      )}
      {deletingRow && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setDeletingRow(null)}>
          <section className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" onMouseDown={(event) => event.stopPropagation()}>
            <h2 id="delete-title">Delete truck record?</h2>
            <p>Carrier reference {deletingRow.carrierRef} will be removed from this dashboard.</p>
            <div className="confirm-actions"><button onClick={() => setDeletingRow(null)}>Cancel</button><button className="danger" onClick={confirmDeleteDashboardRow}>Delete</button></div>
          </section>
        </div>
      )}
      {toast && (
        <div className={`toast ${toast.startsWith('Redirecting to container') ? 'info' : ''}`} role="status">
          <Icon name={toast.startsWith('Redirecting to container') ? 'nav-ship.svg' : 'check.svg'} />
          {toast}
        </div>
      )}
    </div>
  );
}
