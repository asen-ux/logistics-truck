import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const A = `${import.meta.env.BASE_URL}assets/`;

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
        <div className="brand" aria-label="Logistic">
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
type DashboardDateSort = {
  field: 'eta' | 'ata';
  direction: 'asc' | 'desc';
};
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

function Cost({ collapsed, data }: { collapsed: boolean; data: CostDraft }) {
  if (collapsed) return null;
  return (
    <div className="section-content cost-content">
      <h3>Auto Alocation</h3>
      <DataTable
        headers={['Auto Alocation Type', 'OTR Costs', 'Costs Details', 'Total']}
        rows={[[data.auto.allocationType, formatMoney(parseAmount(data.auto.otrCosts)), formatCostLines(data.auto.items), costTotal(data.auto.items)]]}
        className="cost-table"
      />
      <h3>Manual Alocation</h3>
      <DataTable
        headers={['PO-Shipment', 'OTR Costs', 'Costs Details', 'Total']}
        rows={data.manual.map((row) => [row.poShipment, formatMoney(parseAmount(row.otrCosts)), formatCostLines(row.items), costTotal(row.items)])}
        className="cost-table"
      />
    </div>
  );
}

function Carrier({ collapsed, data, onNotify }: { collapsed: boolean; data: CarrierDraft; onNotify: (message: string) => void }) {
  if (collapsed) return null;
  return (
    <div className="section-content carrier-content">
      <div className="three-fields">
        <Field label="OTR">{data.otr}</Field>
        <Field label="US OTR Carrier">{data.usOtrCarrier}</Field>
        <Field label="Carrier Ref No." action={<button className="text-link" onClick={() => onNotify(`Merge started for ${data.carrierRefNo}.`)}>Merge</button>}>{data.carrierRefNo}</Field>
        <Field label="From">{data.from}</Field>
        <Field label="To">{data.to}</Field>
        <Field label="Mileage（m）">{data.mileage}</Field>
        <Field label="Driver Name">{data.driverName}</Field>
        <Field label="License Plate">{data.licensePlate}</Field>
        <Field label="Driver Phone">{data.driverPhone}</Field>
      </div>
      <div className="table-title-row">
        <h3>Transportation Log</h3>
        <button className="text-link" onClick={() => onNotify('Opening transportation map.')}><Icon name="frame4.svg" /> Map</button>
      </div>
      <DataTable
        headers={['Date/Time', 'Loacation', 'Notes', 'Miles to Delivery']}
        rows={data.transportLog.map((row) => [row.dateTime, row.location, row.notes, row.milesToDelivery])}
      />
    </div>
  );
}

function Delivered({ collapsed, data }: { collapsed: boolean; data: DeliveredDraft }) {
  if (collapsed) return null;
  return (
    <div className="section-content delivered-content">
      <Field label="Deliver Type">{data.deliverType}</Field>
      <div className="delivery-columns">
        <div>
          <Field label="Truck Departure">
            <span className="date-line"><Icon name="frame5.svg" /> ETD Truck：{data.etdTruck}</span>
            <span className="date-line"><Icon name="frame6.svg" /> ATD Truck：{data.atdTruck}</span>
          </Field>
          <Field label="Remarks">{data.departureRemarks}</Field>
          <Field label="POD File">{data.podFiles.join(', ') || '-'}</Field>
        </div>
        <div>
          <Field label="Job Site Arrival">
            <span className="date-line"><Icon name="frame5.svg" /> ETA Job Site for Customer： <span className="alert-date"><Icon name="frame7.svg" />{data.etaJobSite}</span></span>
            <span className="date-line"><Icon name="frame6.svg" /> ATA Job Site：{data.ataJobSite}</span>
          </Field>
          <Field label="Remarks">{data.arrivalRemarks}</Field>
          <Field label="POD Received Date">{data.podReceivedDate}</Field>
        </div>
      </div>
    </div>
  );
}

const sectionNames = ['Basic Info', 'Cost', 'Carrier', 'Delivered'] as const;
type SectionName = (typeof sectionNames)[number];

const drawerSections = ['Base Info', 'Cost', 'Carrier', 'Delivered'] as const;
type DrawerSection = (typeof drawerSections)[number];
type PackageRow = {
  pallet: string;
  itemDescription: string;
  blockNo: string;
  cbxNo: string;
  packageNo: string;
  packages: string;
  grossWeight: string;
  price: string;
};
type BaseInfoDraft = {
  deliverType: string;
  containerNo: string;
  pallet: string;
  packageList: PackageRow[];
  loadingList: string;
  sapDeliveryNo: string;
  sap: SapState;
  deliveryDate: string;
  postingDate: string;
};
type CostItem = {
  type: string;
  amount: string;
};
type AutoCostDraft = {
  allocationType: string;
  otrCosts: string;
  items: CostItem[];
};
type ManualCostBlock = {
  poShipment: string;
  otrCosts: string;
  items: CostItem[];
};
type CostDraft = {
  mode: 'auto' | 'manual';
  auto: AutoCostDraft;
  manual: ManualCostBlock[];
};
type TransportLogRow = {
  dateTime: string;
  location: string;
  notes: string;
  milesToDelivery: string;
};
type CarrierDraft = {
  otr: string;
  usOtrCarrier: string;
  carrierRefNo: string;
  from: string;
  to: string;
  mileage: string;
  driverName: string;
  licensePlate: string;
  driverPhone: string;
  transportLog: TransportLogRow[];
};
type DeliveredDraft = {
  deliverType: string;
  etdTruck: string;
  atdTruck: string;
  departureRemarks: string;
  podFiles: string[];
  etaJobSite: string;
  ataJobSite: string;
  arrivalRemarks: string;
  podReceivedDate: string;
};
type TruckDrawerData = {
  'Base Info': BaseInfoDraft;
  Cost: CostDraft;
  Carrier: CarrierDraft;
  Delivered: DeliveredDraft;
};
type PendingDrawerAction = { type: 'close' } | { type: 'open'; row: DashboardRow; section?: DrawerSection };

const deliverTypeOptions = ['Port → Job site', 'Port → Warehouse', 'Warehouse → Job site'] as const;
const palletOptions = ['PL1', 'PL2', 'PL3', 'PL4', 'PL5', 'PL6', 'PL7', 'PL8'] as const;
const autoAllocationTypes = ['By Quontity', 'By Valuc', 'By Net Weight'] as const;
const costTypeOptions = ['Chassis', 'Transloading Costs', 'Demurrage', 'XXX'] as const;
const poShipmentOptions = ['PO-US-25,00394-1st', 'PO-US-25,00394-2st'] as const;
const otrOptions = ['Flatbed', 'Drayage', 'Dry Van', 'Hotshot'] as const;
const usOtrOptions = ['TQL', 'J.B. Hunt Transport', 'Schneider National'] as const;

function toPalletCode(pallet: string) {
  const match = pallet.match(/(\d+)/);
  if (match) return `PL${match[1]}`;
  return palletOptions.includes(pallet as (typeof palletOptions)[number]) ? pallet : 'PL1';
}

function toCarrierCode(carrier: string) {
  if (carrier === 'Total Quality Logistics') return 'TQL';
  return usOtrOptions.includes(carrier as (typeof usOtrOptions)[number]) ? carrier : carrier || 'TQL';
}

function parseAmount(value: string) {
  return Number(String(value).replace(/[^0-9.]/g, '')) || 0;
}

function formatMoney(value: number) {
  return `$ ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatCostLines(items: CostItem[]) {
  return items.map((item) => `$ ${item.amount} ${item.type}`).join('\n');
}

function costTotal(items: CostItem[]) {
  return formatMoney(items.reduce((sum, item) => sum + parseAmount(item.amount), 0));
}

function emptyIfDash(value: string) {
  return !value || value === '-' ? '' : value;
}

const packageColumns = [
  ['pallet', 'Pallet'],
  ['itemDescription', 'Item description'],
  ['blockNo', 'Block No.'],
  ['cbxNo', 'CBX No.'],
  ['packageNo', 'Package No.'],
  ['packages', 'Packages'],
  ['grossWeight', 'Gross weight (kg)'],
  ['price', 'Price ($)'],
] as const;

const defaultPackageRow: PackageRow = {
  pallet: 'Pallet 1',
  itemDescription: 'LYNX',
  blockNo: 'INV105',
  cbxNo: 'LBD15',
  packageNo: 'Reel',
  packages: '1',
  grossWeight: '1100.28',
  price: '2200.11',
};

function createPackageRows(record?: DashboardRow): PackageRow[] {
  const row = record
    ? {
        pallet: record.pallet,
        itemDescription: record.packageItem,
        blockNo: record.blockNo,
        cbxNo: record.cbxNo,
        packageNo: record.packageNo,
        packages: record.packages,
        grossWeight: record.grossWeight,
        price: record.price,
      }
    : defaultPackageRow;
  return Array.from({ length: 4 }, () => ({ ...row }));
}

function createBaseInfoDraft(record?: DashboardRow): BaseInfoDraft {
  if (!record) {
    return {
      deliverType: 'Port → Warehouse',
      containerNo: 'HGOU6417796',
      pallet: 'PL1',
      packageList: createPackageRows(),
      loadingList: 'wamp Cabbage-1st-PL3-PackingSlip.pdf',
      sapDeliveryNo: '-',
      sap: 'success',
      deliveryDate: '',
      postingDate: '2025-10-30',
    };
  }
  return {
    deliverType: record.deliveryType,
    containerNo: record.container,
    pallet: toPalletCode(record.pallet),
    packageList: createPackageRows(record),
    loadingList: `${record.carrierRef}-${record.shipment}-PackingSlip.pdf`,
    sapDeliveryNo: record.sapDeliveryNo || '-',
    sap: record.sap,
    deliveryDate: record.ata,
    postingDate: record.eta,
  };
}

const defaultCostItems: CostItem[] = [
  { type: 'Chassis', amount: '100,000.00' },
  { type: 'Transloading Costs', amount: '50,000.00' },
  { type: 'Demurrage', amount: '50,000.00' },
];

function createCostDraft(): CostDraft {
  return {
    mode: 'auto',
    auto: {
      allocationType: 'By Quontity',
      otrCosts: '50,000.00',
      items: defaultCostItems.map((item) => ({ ...item })),
    },
    manual: [
      {
        poShipment: 'PO-US-25,00394-1st',
        otrCosts: '50,000.00',
        items: defaultCostItems.map((item) => ({ ...item })),
      },
    ],
  };
}

function createTransportLog(): TransportLogRow[] {
  return transportRows.map(([dateTime, location, notes, milesToDelivery]) => ({
    dateTime,
    location,
    notes,
    milesToDelivery,
  }));
}

function createCarrierDraft(record?: DashboardRow): CarrierDraft {
  if (!record) {
    return {
      otr: 'Drayage',
      usOtrCarrier: 'TQL',
      carrierRefNo: '',
      from: 'Ningbo Zhejiang China',
      to: 'US',
      mileage: '',
      driverName: '',
      licensePlate: '',
      driverPhone: '',
      transportLog: createTransportLog(),
    };
  }
  return {
    otr: record.otr,
    usOtrCarrier: toCarrierCode(record.carrier),
    carrierRefNo: record.carrierRef,
    from: record.from || '-',
    to: record.to || '-',
    mileage: record.mileage || '-',
    driverName: record.driverName || '-',
    licensePlate: record.licensePlate || '-',
    driverPhone: record.driverPhone || '-',
    transportLog: createTransportLog(),
  };
}

function createDeliveredDraft(record?: DashboardRow): DeliveredDraft {
  if (!record) {
    return {
      deliverType: 'Port → Job site',
      etdTruck: '2025-12-08',
      atdTruck: '2025-12-08',
      departureRemarks: '',
      podFiles: [],
      etaJobSite: '2025-12-08',
      ataJobSite: '2025-12-08',
      arrivalRemarks: '',
      podReceivedDate: '',
    };
  }
  return {
    deliverType: record.deliveryType,
    etdTruck: record.etd,
    atdTruck: record.atd,
    departureRemarks: '',
    podFiles: [],
    etaJobSite: record.eta,
    ataJobSite: record.ata,
    arrivalRemarks: '',
    podReceivedDate: '',
  };
}

function createTruckDrawerData(record?: DashboardRow): TruckDrawerData {
  return {
    'Base Info': createBaseInfoDraft(record),
    Cost: createCostDraft(),
    Carrier: createCarrierDraft(record),
    Delivered: createDeliveredDraft(record),
  };
}

function cloneTruckDrawerData(data: TruckDrawerData): TruckDrawerData {
  return {
    'Base Info': {
      ...data['Base Info'],
      packageList: data['Base Info'].packageList.map((row) => ({ ...row })),
    },
    Cost: {
      mode: data.Cost.mode,
      auto: { ...data.Cost.auto, items: data.Cost.auto.items.map((item) => ({ ...item })) },
      manual: data.Cost.manual.map((row) => ({ ...row, items: row.items.map((item) => ({ ...item })) })),
    },
    Carrier: {
      ...data.Carrier,
      transportLog: data.Carrier.transportLog.map((row) => ({ ...row })),
    },
    Delivered: { ...data.Delivered, podFiles: [...data.Delivered.podFiles] },
  };
}

function isDrawerSectionDirty(section: DrawerSection, draft: TruckDrawerData, saved: TruckDrawerData) {
  return JSON.stringify(draft[section]) !== JSON.stringify(saved[section]);
}

function applyBaseInfoToRow(row: DashboardRow, base: BaseInfoDraft): DashboardRow {
  const pkg = base.packageList[0];
  return {
    ...row,
    deliveryType: base.deliverType,
    container: base.containerNo,
    pallet: base.pallet,
    packageItem: pkg?.itemDescription ?? row.packageItem,
    blockNo: pkg?.blockNo ?? row.blockNo,
    cbxNo: pkg?.cbxNo ?? row.cbxNo,
    packageNo: pkg?.packageNo ?? row.packageNo,
    packages: pkg?.packages ?? row.packages,
    grossWeight: pkg?.grossWeight ?? row.grossWeight,
    price: pkg?.price ?? row.price,
    sapDeliveryNo: base.sapDeliveryNo,
    sap: base.sap,
    ata: base.deliveryDate,
    eta: base.postingDate,
  };
}

function applyCarrierToRow(row: DashboardRow, carrier: CarrierDraft): DashboardRow {
  return {
    ...row,
    otr: carrier.otr,
    carrier: carrier.usOtrCarrier,
    carrierRef: carrier.carrierRefNo,
    from: carrier.from,
    to: carrier.to,
    mileage: carrier.mileage,
    driverName: carrier.driverName,
    licensePlate: carrier.licensePlate,
    driverPhone: carrier.driverPhone,
  };
}

function applyDeliveredToRow(row: DashboardRow, delivered: DeliveredDraft): DashboardRow {
  return {
    ...row,
    deliveryType: delivered.deliverType,
    etd: delivered.etdTruck,
    atd: delivered.atdTruck,
    eta: delivered.etaJobSite,
    ata: delivered.ataJobSite,
  };
}

function BaseInfoEditor({
  value,
  onChange,
}: {
  value: BaseInfoDraft;
  onChange: (next: BaseInfoDraft) => void;
}) {
  function update<K extends keyof Omit<BaseInfoDraft, 'packageList'>>(key: K, nextValue: BaseInfoDraft[K]) {
    onChange({ ...value, [key]: nextValue });
  }

  return (
    <div className="drawer-base-info">
      <fieldset className="drawer-radio-group">
        <legend><span className="required">*</span>Deliver Type</legend>
        <div className="drawer-radio-options">
          {deliverTypeOptions.map((option) => (
            <label key={option} className="drawer-radio">
              <input
                type="radio"
                name="deliver-type"
                value={option}
                checked={value.deliverType === option}
                onChange={() => update('deliverType', option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="drawer-base-row">
        <label className="truck-drawer-field">
          <span><span className="required">*</span>Container No.</span>
          <input type="text" value={value.containerNo} onChange={(event) => update('containerNo', event.target.value)} required aria-label="Container No." />
        </label>
        <label className="truck-drawer-field">
          <span>Pallet</span>
          <Dropdown
            className="table-dropdown-trigger"
            value={value.pallet}
            onChange={(pallet) => update('pallet', pallet)}
            ariaLabel="Pallet"
            options={[
              ...palletOptions.map((option) => ({ value: option, label: option })),
              ...(!palletOptions.includes(value.pallet as (typeof palletOptions)[number]) && value.pallet
                ? [{ value: value.pallet, label: value.pallet }]
                : []),
            ]}
          />
        </label>
      </div>
      <div className="drawer-base-block">
        <h4>Package List</h4>
        <DataTable
          className="drawer-data-table"
          headers={packageColumns.map(([, label]) => label)}
          rows={value.packageList.map((row) => packageColumns.map(([key]) => row[key]))}
        />
      </div>
      <div className="truck-drawer-field">
        <span>Loading List</span>
        <div className="drawer-readonly-file">{value.loadingList || '-'}</div>
      </div>
      <div className="drawer-base-row">
        <label className="truck-drawer-field">
          <span>Delivery Date</span>
          <DateInput value={value.deliveryDate} onChange={(deliveryDate) => update('deliveryDate', deliveryDate)} ariaLabel="Delivery Date" />
        </label>
        <div className="truck-drawer-field">
          <span>Posting Date</span>
          <div className="drawer-readonly-value">{value.postingDate || '-'}</div>
        </div>
      </div>
    </div>
  );
}

function SegmentedOptions({
  label,
  required,
  value,
  options,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="truck-drawer-field">
      <span>{required && <span className="required">*</span>}{label}</span>
      <div className="drawer-segment" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={value === option ? 'is-active' : ''}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function CostItemsEditor({
  items,
  onChange,
}: {
  items: CostItem[];
  onChange: (items: CostItem[]) => void;
}) {
  const [costType, setCostType] = useState('');
  const [amount, setAmount] = useState('');

  function addCost() {
    if (!costType || !amount.trim()) return;
    onChange([...items, { type: costType, amount: amount.trim() }]);
    setCostType('');
    setAmount('');
  }

  return (
    <div className="drawer-cost-items">
      <div className="drawer-cost-composer">
        <span className="drawer-cost-label">Cost</span>
        <div className="drawer-cost-add">
          <Dropdown
            className="table-dropdown-trigger"
            value={costType}
            onChange={setCostType}
            ariaLabel="Cost type"
            placeholder="Cost type"
            options={[
              { value: '', label: 'Cost type' },
              ...costTypeOptions.map((option) => ({ value: option, label: option })),
            ]}
          />
          <input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Please enter" aria-label="Cost amount" />
          <button type="button" className="text-link" onClick={addCost}>+ Add Cost</button>
        </div>
        {items.length > 0 && (
          <div className="drawer-cost-tags">
            {items.map((item, index) => (
              <span className="drawer-cost-tag" key={`${item.type}-${index}`}>
                {item.type} {item.amount}
                <button type="button" aria-label={`Remove ${item.type}`} onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="drawer-cost-total">Total Cost {costTotal(items)}</div>
    </div>
  );
}

function CostEditor({
  value,
  onChange,
}: {
  value: CostDraft;
  onChange: (next: CostDraft) => void;
}) {
  function updateAuto(next: Partial<AutoCostDraft>) {
    onChange({ ...value, auto: { ...value.auto, ...next } });
  }

  function updateManual(index: number, next: Partial<ManualCostBlock>) {
    onChange({
      ...value,
      manual: value.manual.map((row, rowIndex) => (rowIndex === index ? { ...row, ...next } : row)),
    });
  }

  return (
    <div className="drawer-cost-info">
      <SegmentedOptions
        label="Cost Allocation"
        required
        value={value.mode === 'auto' ? 'Auto Allocation' : 'Manual Alocation'}
        options={['Auto Allocation', 'Manual Alocation']}
        onChange={(mode) => onChange({ ...value, mode: mode === 'Auto Allocation' ? 'auto' : 'manual' })}
      />
      {value.mode === 'auto' ? (
        <>
          <SegmentedOptions
            label="Auto Allocation Type"
            required
            value={value.auto.allocationType}
            options={autoAllocationTypes}
            onChange={(allocationType) => updateAuto({ allocationType })}
          />
          <label className="truck-drawer-field">
            <span><span className="required">*</span>OTR Costs</span>
            <input value={value.auto.otrCosts} onChange={(event) => updateAuto({ otrCosts: event.target.value })} placeholder="Enter OTR costs" aria-label="OTR Costs" />
          </label>
          <CostItemsEditor items={value.auto.items} onChange={(items) => updateAuto({ items })} />
        </>
      ) : (
        <>
          {value.manual.map((block, index) => (
            <div className="drawer-allocation-block" key={`${block.poShipment}-${index}`}>
              <div className="drawer-allocation-head">
                <strong>Alocation {index + 1}</strong>
                {index > 0 && (
                  <button
                    type="button"
                    className="drawer-allocation-delete"
                    aria-label={`Delete Alocation ${index + 1}`}
                    onClick={() => onChange({ ...value, manual: value.manual.filter((_, rowIndex) => rowIndex !== index) })}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="drawer-allocation-body">
                <div className="drawer-allocation-fields">
                  <label className="truck-drawer-field">
                    <span><span className="required">*</span>PO-Shipment</span>
                    <Dropdown
                      className="table-dropdown-trigger"
                      value={block.poShipment}
                      onChange={(poShipment) => updateManual(index, { poShipment })}
                      ariaLabel={`PO-Shipment ${index + 1}`}
                      placeholder="Please select"
                      options={[
                        { value: '', label: 'Please select' },
                        ...poShipmentOptions.map((option) => ({ value: option, label: option })),
                      ]}
                    />
                  </label>
                  <label className="truck-drawer-field">
                    <span><span className="required">*</span>OTR Costs</span>
                    <input value={block.otrCosts} onChange={(event) => updateManual(index, { otrCosts: event.target.value })} placeholder="Please enter" aria-label={`OTR Costs ${index + 1}`} />
                  </label>
                </div>
                <CostItemsEditor items={block.items} onChange={(items) => updateManual(index, { items })} />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="text-link drawer-add-allocation"
            onClick={() => onChange({
              ...value,
              manual: [...value.manual, { poShipment: '', otrCosts: '', items: [] }],
            })}
          >
            + Add Alocation Item
          </button>
        </>
      )}
    </div>
  );
}

function CarrierEditor({
  value,
  onChange,
}: {
  value: CarrierDraft;
  onChange: (next: CarrierDraft) => void;
}) {
  function update<K extends keyof Omit<CarrierDraft, 'transportLog'>>(key: K, nextValue: CarrierDraft[K]) {
    onChange({ ...value, [key]: nextValue });
  }

  return (
    <div className="drawer-carrier-info">
      <fieldset className="drawer-radio-group">
        <legend><span className="required">*</span>OTR</legend>
        <div className="drawer-radio-options">
          {otrOptions.map((option) => (
            <label key={option} className="drawer-radio">
              <input type="radio" name="otr-type" value={option} checked={value.otr === option} onChange={() => update('otr', option)} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="truck-drawer-field">
        <span><span className="required">*</span>US OTR Carrier</span>
        <Dropdown
          className="table-dropdown-trigger"
          value={value.usOtrCarrier}
          onChange={(usOtrCarrier) => update('usOtrCarrier', usOtrCarrier)}
          ariaLabel="US OTR Carrier"
          options={[
            ...usOtrOptions.map((option) => ({ value: option, label: option })),
            ...(!usOtrOptions.includes(value.usOtrCarrier as (typeof usOtrOptions)[number]) && value.usOtrCarrier
              ? [{ value: value.usOtrCarrier, label: value.usOtrCarrier }]
              : []),
          ]}
        />
      </label>
      <label className="truck-drawer-field">
        <span><span className="required">*</span>Carrier Ref No.</span>
        <input type="text" value={value.carrierRefNo} onChange={(event) => update('carrierRefNo', event.target.value)} placeholder="Enter carrier ref number" aria-label="Carrier Ref No." />
      </label>
      <label className="truck-drawer-field">
        <span>From</span>
        <input type="text" value={emptyIfDash(value.from)} onChange={(event) => update('from', event.target.value)} placeholder="Enter origin" aria-label="From" />
      </label>
      <label className="truck-drawer-field">
        <span>To</span>
        <input type="text" value={emptyIfDash(value.to)} onChange={(event) => update('to', event.target.value)} placeholder="Enter destination" aria-label="To" />
      </label>
      <label className="truck-drawer-field">
        <span>Mileage (m)</span>
        <input type="text" inputMode="numeric" value={emptyIfDash(value.mileage)} onChange={(event) => update('mileage', event.target.value)} placeholder="Enter Mileage" aria-label="Mileage" />
      </label>
      <label className="truck-drawer-field">
        <span>Driver Name</span>
        <input type="text" value={emptyIfDash(value.driverName)} onChange={(event) => update('driverName', event.target.value)} placeholder="Enter driver name" aria-label="Driver Name" />
      </label>
      <label className="truck-drawer-field">
        <span>License Plate</span>
        <input type="text" value={emptyIfDash(value.licensePlate)} onChange={(event) => update('licensePlate', event.target.value)} placeholder="Enter license plate" aria-label="License Plate" />
      </label>
      <label className="truck-drawer-field">
        <span>Driver Phone</span>
        <input type="tel" value={emptyIfDash(value.driverPhone)} onChange={(event) => update('driverPhone', event.target.value)} placeholder="XXX-XXX-XXXX" aria-label="Driver Phone" />
      </label>
    </div>
  );
}

function DeliveredEditor({
  value,
  onChange,
}: {
  value: DeliveredDraft;
  onChange: (next: DeliveredDraft) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof DeliveredDraft>(key: K, nextValue: DeliveredDraft[K]) {
    onChange({ ...value, [key]: nextValue });
  }

  return (
    <div className="drawer-delivered-info">
      <fieldset className="drawer-radio-group">
        <legend><span className="required">*</span>Deliver Type</legend>
        <div className="drawer-radio-options">
          {deliverTypeOptions.map((option) => (
            <label key={option} className="drawer-radio">
              <input type="radio" name="delivered-type" value={option} checked={value.deliverType === option} onChange={() => update('deliverType', option)} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="drawer-base-block">
        <h4>Truck Departure</h4>
        <label className="truck-drawer-field">
          <span>ETD Truck</span>
          <DateInput value={value.etdTruck} onChange={(etdTruck) => update('etdTruck', etdTruck)} ariaLabel="ETD Truck" />
        </label>
        <label className="truck-drawer-field">
          <span>ATD Truck</span>
          <DateInput value={value.atdTruck} onChange={(atdTruck) => update('atdTruck', atdTruck)} ariaLabel="ATD Truck" />
        </label>
        <label className="truck-drawer-field">
          <span>Remarks</span>
          <textarea value={emptyIfDash(value.departureRemarks)} onChange={(event) => update('departureRemarks', event.target.value)} placeholder="Please enter" aria-label="Truck departure remarks" rows={3} />
        </label>
      </div>
      <div className="drawer-base-block">
        <h4>Job Site Arrival</h4>
        <label className="truck-drawer-field">
          <span>ETA Job Site for Customer</span>
          <DateInput value={value.etaJobSite} onChange={(etaJobSite) => update('etaJobSite', etaJobSite)} ariaLabel="ETA Job Site for Customer" />
        </label>
        <label className="truck-drawer-field">
          <span>ATA Job Site</span>
          <DateInput value={value.ataJobSite} onChange={(ataJobSite) => update('ataJobSite', ataJobSite)} ariaLabel="ATA Job Site" />
        </label>
        <label className="truck-drawer-field">
          <span>Remarks</span>
          <textarea value={emptyIfDash(value.arrivalRemarks)} onChange={(event) => update('arrivalRemarks', event.target.value)} placeholder="Please enter" aria-label="Job site arrival remarks" rows={3} />
        </label>
      </div>
      <div className="truck-drawer-field">
        <span>POD Files</span>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={(event) => {
            const names = Array.from(event.target.files ?? []).map((file) => file.name);
            if (names.length) update('podFiles', [...value.podFiles, ...names]);
            event.target.value = '';
          }}
        />
        <button type="button" className="drawer-file-select" onClick={() => fileInputRef.current?.click()}>
          Select Files
        </button>
        {value.podFiles.length > 0 && (
          <div className="drawer-cost-tags">
            {value.podFiles.map((file) => (
              <span className="drawer-cost-tag" key={file}>
                {file}
                <button type="button" aria-label={`Remove ${file}`} onClick={() => update('podFiles', value.podFiles.filter((name) => name !== file))}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      <label className="truck-drawer-field">
        <span>POD Received Date</span>
        <DateInput value={emptyIfDash(value.podReceivedDate)} onChange={(podReceivedDate) => update('podReceivedDate', podReceivedDate)} ariaLabel="POD Received Date" />
      </label>
    </div>
  );
}

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

const dateWeekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
const dateMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const;

function parseISODate(value: string) {
  if (!value || value === '-') return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateDisplay(value: string) {
  const date = parseISODate(value);
  return date ? toISODate(date).replaceAll('-', ' / ') : '';
}

function calendarDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function DateInput({
  value,
  onChange,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [visibleMonth, setVisibleMonth] = useState(() => parseISODate(value) ?? new Date());
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected = parseISODate(value);
  const display = formatDateDisplay(value);
  const today = toISODate(new Date());

  function openCalendar() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = 292;
    const height = 336;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    const top = rect.bottom + 6 + height <= window.innerHeight
      ? rect.bottom + 6
      : Math.max(8, rect.top - height - 6);
    setVisibleMonth(selected ?? new Date());
    setPosition({ top, left });
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

  return (
    <span className="date-input-wrap">
      <button
        ref={triggerRef}
        type="button"
        className={`date-input-trigger${display ? '' : ' is-empty'}`}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openCalendar())}
      >
        <span>{display || 'YYYY / MM / DD'}</span>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <rect x="3.5" y="4.5" width="13" height="12" rx="1.5" />
          <path d="M3.5 8h13M7 3v3M13 3v3" />
        </svg>
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          className="date-picker"
          role="dialog"
          aria-label={ariaLabel}
          style={position}
        >
          <div className="date-picker-head">
            <button type="button" aria-label="Previous month" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}>
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12 5-5 5 5 5" /></svg>
            </button>
            <strong>{dateMonths[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}</strong>
            <button type="button" aria-label="Next month" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}>
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 5 5 5-5 5" /></svg>
            </button>
          </div>
          <div className="date-picker-week">
            {dateWeekdays.map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="date-picker-grid">
            {calendarDays(visibleMonth).map((date) => {
              const iso = toISODate(date);
              const outside = date.getMonth() !== visibleMonth.getMonth();
              return (
                <button
                  type="button"
                  key={iso + String(outside)}
                  className={`${iso === value ? 'is-selected' : ''}${iso === today ? ' is-today' : ''}${outside ? ' is-outside' : ''}`}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
          <div className="date-picker-foot">
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
                triggerRef.current?.focus();
              }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(today);
                setVisibleMonth(new Date());
                setOpen(false);
                triggerRef.current?.focus();
              }}
            >
              Today
            </button>
          </div>
        </div>,
        document.body,
      )}
    </span>
  );
}

function Dropdown({ value, options, onChange, ariaLabel, className = '', placeholder = '' }: {
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
  placeholder?: string;
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
  const isPlaceholder = !value && Boolean(placeholder);
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
        <span className={isPlaceholder ? 'is-placeholder' : ''}>{selected?.label ?? (value || placeholder)}</span>
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

function compareDashboardDates(left: string, right: string) {
  const emptyLeft = !left || left === '-';
  const emptyRight = !right || right === '-';
  if (emptyLeft && emptyRight) return 0;
  if (emptyLeft) return 1;
  if (emptyRight) return -1;
  return left.localeCompare(right);
}

function DashboardSortHeader({
  label,
  field,
  sort,
  onSort,
}: {
  label: string;
  field: DashboardDateSort['field'];
  sort: DashboardDateSort | null;
  onSort: (field: DashboardDateSort['field']) => void;
}) {
  const active = sort?.field === field;
  const direction = active ? sort.direction : undefined;
  return (
    <th aria-sort={direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'}>
      <button
        type="button"
        className={`dashboard-sort${active ? ` is-${direction}` : ''}`}
        onClick={() => onSort(field)}
        aria-label={active
          ? `Sort by ${label}, currently ${direction === 'asc' ? 'ascending' : 'descending'}`
          : `Sort by ${label}`}
      >
        <span>{label}</span>
        <span className="dashboard-sort-icons" aria-hidden="true">
          <svg className="sort-up" viewBox="0 0 10 6"><path d="M5 1.2 1.6 5h6.8L5 1.2z" /></svg>
          <svg className="sort-down" viewBox="0 0 10 6"><path d="M5 4.8 8.4 1H1.6L5 4.8z" /></svg>
        </span>
      </button>
    </th>
  );
}

function DashboardTable({ rows, page, totalPages, searchDraft, shipmentFilter, otrFilter, sort, onSearchDraftChange, onSearch, onShipmentFilter, onOtrFilter, onSort, onPage, onChange, onOpenRecord, onOpenContainer, onSubmit }: {
  rows: DashboardRow[];
  page: number;
  totalPages: number;
  searchDraft: string;
  shipmentFilter: string;
  otrFilter: string;
  sort: DashboardDateSort | null;
  onSearchDraftChange: (value: string) => void;
  onSearch: () => void;
  onShipmentFilter: (value: string) => void;
  onOtrFilter: (value: string) => void;
  onSort: (field: DashboardDateSort['field']) => void;
  onPage: (page: number) => void;
  onChange: (id: number, field: keyof DashboardRow, value: string) => void;
  onOpenRecord: (row: DashboardRow) => void;
  onOpenContainer: (row: DashboardRow) => void;
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
            <th>Carrier Ref No.</th>
            <th>Shipment</th>
            <th>Container</th>
            <th>Deliver Type</th>
            <th>OTR</th>
            <th>US OTR Carrier</th>
            <DashboardSortHeader label="ETA Job Site for Customer" field="eta" sort={sort} onSort={onSort} />
            <DashboardSortHeader label="ATA Job Site" field="ata" sort={sort} onSort={onSort} />
            <th>SAP Delivery</th>
          </tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td><button className="dashboard-link carrier-ref-link" onClick={() => onOpenRecord(row)} aria-label={`Open carrier reference ${row.carrierRef} in ${row.shipment} tab`}>{row.carrierRef}</button></td>
                <td>{row.shipment}</td>
                <td><button className="dashboard-link" onClick={() => onOpenContainer(row)} aria-label={`Open container ${row.container}`}>{row.container}</button></td>
                <td>
                  <Dropdown
                    className="table-dropdown-trigger"
                    value={row.deliveryType}
                    onChange={(value) => onChange(row.id, 'deliveryType', value)}
                    ariaLabel={`Delivery type for ${row.carrierRef}`}
                    options={[
                      { value: 'Port → Job site', label: 'Port → Job site' },
                      { value: 'Warehouse → Job site', label: 'Warehouse → Job site' },
                      { value: 'Port → Warehouse', label: 'Port → Warehouse' },
                      ...(!deliverTypeOptions.includes(row.deliveryType as (typeof deliverTypeOptions)[number]) && row.deliveryType
                        ? [{ value: row.deliveryType, label: row.deliveryType }]
                        : []),
                    ]}
                  />
                </td>
                <td>
                  <Dropdown
                    className="table-dropdown-trigger"
                    value={row.otr}
                    onChange={(value) => onChange(row.id, 'otr', value)}
                    ariaLabel={`OTR for ${row.carrierRef}`}
                    options={[
                      { value: 'Hotshot', label: 'Hotshot' },
                      { value: 'Flatbed', label: 'Flatbed' },
                      { value: 'Dry Van', label: 'Dry Van' },
                      { value: 'Drayage', label: 'Drayage' },
                      ...(!otrOptions.includes(row.otr as (typeof otrOptions)[number]) && row.otr
                        ? [{ value: row.otr, label: row.otr }]
                        : []),
                    ]}
                  />
                </td>
                <td>
                  <Dropdown
                    className="table-dropdown-trigger"
                    value={row.carrier}
                    onChange={(value) => onChange(row.id, 'carrier', value)}
                    ariaLabel={`Carrier for ${row.carrierRef}`}
                    options={[
                      { value: 'Total Quality Logistics', label: 'Total Quality Logistics' },
                      { value: 'J.B. Hunt Transport', label: 'J.B. Hunt Transport' },
                      { value: 'Schneider National', label: 'Schneider National' },
                      ...(!['Total Quality Logistics', 'J.B. Hunt Transport', 'Schneider National'].includes(row.carrier) && row.carrier
                        ? [{ value: row.carrier, label: row.carrier }]
                        : []),
                    ]}
                  />
                </td>
                <td><DateInput value={row.eta} onChange={(value) => onChange(row.id, 'eta', value)} ariaLabel={`ETA Job Site for Customer for ${row.carrierRef}`} /></td>
                <td><DateInput value={row.ata} onChange={(value) => onChange(row.id, 'ata', value)} ariaLabel={`ATA Job Site for ${row.carrierRef}`} /></td>
                <td>
                  {row.sap === 'idle' && <div className="inline-actions"><button type="button">View</button><button onClick={() => onSubmit(row)}>Submit</button></div>}
                  {row.sap === 'syncing' && <span className="sap-syncing"><span className="mini-spinner" /> Synchronizing…</span>}
                  {row.sap === 'success' && <span className="sap-status success"><Icon name="check.svg" size={12} /> SAP synchronization successful.</span>}
                  {row.sap === 'error' && <span className="sap-status success"><Icon name="check.svg" size={12} /> SAP synchronization successful.</span>}
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td className="dashboard-empty" colSpan={9}>No truck records on this page.</td></tr>}
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
  const [dashboardSort, setDashboardSort] = useState<DashboardDateSort | null>(null);
  const [viewingRow, setViewingRow] = useState<DashboardRow | null>(null);
  const [truckDrawerData, setTruckDrawerData] = useState<Record<number, TruckDrawerData>>({});
  const [drawerDraft, setDrawerDraft] = useState<TruckDrawerData>(() => createTruckDrawerData());
  const [drawerSavedSnapshot, setDrawerSavedSnapshot] = useState<TruckDrawerData>(() => createTruckDrawerData());
  const [activeDrawerSection, setActiveDrawerSection] = useState<DrawerSection>('Base Info');
  const [drawerSaveState, setDrawerSaveState] = useState<'idle' | 'saved'>('idle');
  const [sapUnlocked, setSapUnlocked] = useState(false);
  const [pendingDrawerAction, setPendingDrawerAction] = useState<PendingDrawerAction | null>(null);
  const [deletingRow, setDeletingRow] = useState<DashboardRow | null>(null);
  const [collapsed, setCollapsed] = useState<Record<SectionName, boolean>>({
    'Basic Info': false,
    Cost: false,
    Carrier: false,
    Delivered: false,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const drawerContentRef = useRef<HTMLElement>(null);
  const dirtyDrawerSections = drawerSections.filter((section) => (
    isDrawerSectionDirty(section, drawerDraft, drawerSavedSnapshot)
  ));
  const drawerDirty = dirtyDrawerSections.length > 0;
  const sapHint = 'SAP submission will be available after ATA confirmation at the job site.';
  const sapDisabled = !viewingRow
    || !sapUnlocked
    || !drawerDraft.Delivered.ataJobSite
    || drawerDraft.Delivered.ataJobSite === '-'
    || viewingRow.sap === 'syncing'
    || viewingRow.sap === 'success';

  const notify = (message: string) => setToast(message);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (drawerSaveState !== 'saved') return;
    const timer = window.setTimeout(() => setDrawerSaveState('idle'), 2600);
    return () => window.clearTimeout(timer);
  }, [drawerSaveState]);

  useEffect(() => {
    if (!viewingRow) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || deletingRow) return;
      if (pendingDrawerAction) {
        setPendingDrawerAction(null);
        return;
      }
      requestCloseDrawer();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [viewingRow, deletingRow, pendingDrawerAction, drawerDirty]);

  useEffect(() => {
    drawerContentRef.current?.scrollTo({ top: 0 });
  }, [activeDrawerSection]);

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
      deliveryType: `Deliver Type updated to “${value}”.`,
      otr: `OTR updated to “${value}”.`,
      carrier: `US OTR Carrier updated to “${value}”.`,
      eta: `ETA Job Site for Customer updated to ${value}.`,
      ata: `ATA Job Site updated to ${value}.`,
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
    setTruckDrawerData((data) => {
      const next = { ...data };
      delete next[deletingRow.id];
      return next;
    });
    setActiveTruck(nextIndex);
    if (activeTab !== 'Dashboard' && remaining[nextIndex]) setActiveTab(remaining[nextIndex].shipment);
    notify(`Carrier reference ${deletingRow.carrierRef} was deleted.`);
    if (viewingRow?.id === deletingRow.id) setViewingRow(null);
    setDeletingRow(null);
  }

  function openCarrierRecordNow(row: DashboardRow, section: DrawerSection = 'Base Info') {
    const index = dashboardRows.findIndex((item) => item.id === row.id);
    if (index < 0) return;
    setActiveTruck(index);
    const saved = truckDrawerData[row.id] ?? createTruckDrawerData(row);
    setDrawerDraft(cloneTruckDrawerData(saved));
    setDrawerSavedSnapshot(cloneTruckDrawerData(saved));
    setActiveDrawerSection(section);
    setDrawerSaveState('idle');
    setSapUnlocked(false);
    setViewingRow(row);
  }

  function openCarrierRecord(row: DashboardRow, section: DrawerSection = 'Base Info') {
    if (viewingRow && viewingRow.id !== row.id && drawerDirty) {
      setPendingDrawerAction({ type: 'open', row, section });
      return;
    }
    openCarrierRecordNow(row, section);
  }

  function requestCloseDrawer() {
    if (drawerDirty) {
      setPendingDrawerAction({ type: 'close' });
      return;
    }
    setViewingRow(null);
  }

  function updateBaseInfoDraft(next: BaseInfoDraft) {
    setDrawerSaveState('idle');
    setDrawerDraft((draft) => ({
      ...draft,
      'Base Info': next,
    }));
  }

  function updateCostDraft(next: CostDraft) {
    setDrawerSaveState('idle');
    setDrawerDraft((draft) => ({
      ...draft,
      Cost: next,
    }));
  }

  function updateCarrierDraft(next: CarrierDraft) {
    setDrawerSaveState('idle');
    setDrawerDraft((draft) => ({
      ...draft,
      Carrier: next,
    }));
  }

  function updateDeliveredDraft(next: DeliveredDraft) {
    setDrawerSaveState('idle');
    const ata = next.ataJobSite.trim();
    if (ata && ata !== '-') setSapUnlocked(true);
    setDrawerDraft((draft) => ({
      ...draft,
      Delivered: next,
    }));
  }

  function persistDrawerChanges() {
    if (!viewingRow) return false;
    const saved = cloneTruckDrawerData(drawerDraft);
    const baseDirty = isDrawerSectionDirty('Base Info', drawerDraft, drawerSavedSnapshot);
    const deliveredDirty = isDrawerSectionDirty('Delivered', drawerDraft, drawerSavedSnapshot);
    if (saved['Base Info'].deliverType !== saved.Delivered.deliverType) {
      if (deliveredDirty && !baseDirty) {
        saved['Base Info'] = { ...saved['Base Info'], deliverType: saved.Delivered.deliverType };
      } else if (baseDirty && !deliveredDirty) {
        saved.Delivered = { ...saved.Delivered, deliverType: saved['Base Info'].deliverType };
      }
    }
    const nextRow = applyDeliveredToRow(
      applyCarrierToRow(applyBaseInfoToRow(viewingRow, saved['Base Info']), saved.Carrier),
      saved.Delivered,
    );
    setTruckDrawerData((data) => ({
      ...data,
      [viewingRow.id]: saved,
    }));
    setDrawerSavedSnapshot(cloneTruckDrawerData(saved));
    setDashboardRows((rows) => rows.map((row) => row.id === viewingRow.id ? nextRow : row));
    setViewingRow(nextRow);
    return true;
  }

  function saveDrawerChanges() {
    if (!viewingRow || !persistDrawerChanges()) return;
    setDrawerSaveState('saved');
  }

  function continuePendingDrawerAction(saveChanges: boolean) {
    if (!pendingDrawerAction) return;
    const action = pendingDrawerAction;
    const currentCarrierRef = viewingRow?.carrierRef;
    if (saveChanges) persistDrawerChanges();
    setPendingDrawerAction(null);
    if (action.type === 'open') openCarrierRecordNow(action.row, action.section);
    else setViewingRow(null);
    if (saveChanges && currentCarrierRef) notify(`Truck ${currentCarrierRef} updated successfully.`);
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
  const sortedDashboardRows = dashboardSort
    ? [...filteredDashboardRows].sort((left, right) => {
        const result = compareDashboardDates(left[dashboardSort.field], right[dashboardSort.field]);
        return dashboardSort.direction === 'asc' ? result : -result;
      })
    : filteredDashboardRows;
  const dashboardPageSize = 10;
  const dashboardTotalPages = Math.max(1, Math.ceil(sortedDashboardRows.length / dashboardPageSize));
  const currentDashboardPage = Math.min(dashboardPage, dashboardTotalPages);
  const visibleDashboardRows = sortedDashboardRows.slice(
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
                sort={dashboardSort}
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
                onSort={(field) => {
                  setDashboardSort((current) => {
                    if (current?.field !== field) return { field, direction: 'asc' };
                    if (current.direction === 'asc') return { field, direction: 'desc' };
                    return null;
                  });
                  setDashboardPage(1);
                }}
                onPage={(page) => setDashboardPage(Math.max(1, Math.min(dashboardTotalPages, page)))}
                onChange={updateDashboardRow}
                onOpenRecord={openCarrierRecord}
                onOpenContainer={(row) => notify(`Redirecting to container ${row.container}.`)}
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
                  <SectionHeader id="basic-info" title="Base Info" collapsed={collapsed['Basic Info']} onToggle={() => setCollapsed((s) => ({ ...s, 'Basic Info': !s['Basic Info'] }))} onEdit={() => openCarrierRecord(currentRecord)} />
                  <BaseInfo collapsed={collapsed['Basic Info']} record={currentRecord} />
                </section>
                <section data-section="Cost">
                  <SectionHeader id="cost" title="Cost" collapsed={collapsed.Cost} onToggle={() => setCollapsed((s) => ({ ...s, Cost: !s.Cost }))} onEdit={() => openCarrierRecord(currentRecord, 'Cost')} />
                  <Cost collapsed={collapsed.Cost} data={truckDrawerData[currentRecord.id]?.Cost ?? createCostDraft()} />
                </section>
                <section data-section="Carrier">
                  <SectionHeader id="carrier" title="Carrier" collapsed={collapsed.Carrier} onToggle={() => setCollapsed((s) => ({ ...s, Carrier: !s.Carrier }))} onEdit={() => openCarrierRecord(currentRecord, 'Carrier')} />
                  <Carrier collapsed={collapsed.Carrier} data={truckDrawerData[currentRecord.id]?.Carrier ?? createCarrierDraft(currentRecord)} onNotify={notify} />
                </section>
                <section data-section="Delivered">
                  <SectionHeader id="delivered" title="Delivered" collapsed={collapsed.Delivered} onToggle={() => setCollapsed((s) => ({ ...s, Delivered: !s.Delivered }))} onEdit={() => openCarrierRecord(currentRecord, 'Delivered')} />
                  <Delivered collapsed={collapsed.Delivered} data={truckDrawerData[currentRecord.id]?.Delivered ?? createDeliveredDraft(currentRecord)} />
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
        <div className="drawer-backdrop" role="presentation" onMouseDown={requestCloseDrawer}>
          <aside className="truck-drawer" role="dialog" aria-modal="true" aria-labelledby="truck-drawer-title" onMouseDown={(event) => event.stopPropagation()}>
            <header className="truck-drawer-header">
              <div className="drawer-title-row">
                <span className="drawer-truck-mark" aria-hidden="true">
                  <Icon name="nav-truck.svg" size={22} />
                </span>
                <h2 id="truck-drawer-title">{viewingRow.carrierRef}</h2>
                <span className="drawer-shipment-tag">{viewingRow.shipment}</span>
              </div>
              <button className="drawer-close" onClick={requestCloseDrawer} aria-label="Close truck drawer" title="Close">×</button>
            </header>
            <div className="truck-drawer-main">
              <nav className="truck-drawer-nav" role="tablist" aria-label="Truck information categories" aria-orientation="vertical">
                {drawerSections.map((section) => {
                  const isDirty = dirtyDrawerSections.includes(section);
                  return (
                  <button
                    key={section}
                    role="tab"
                    aria-selected={activeDrawerSection === section}
                    aria-controls={`drawer-panel-${section.toLowerCase().replace(' ', '-')}`}
                    className={activeDrawerSection === section ? 'is-active' : ''}
                    onClick={() => setActiveDrawerSection(section)}
                  >
                    <span className="drawer-nav-title">
                      <strong>{section}</strong>
                      {isDirty && <span className="drawer-section-dirty">Modified</span>}
                    </span>
                  </button>
                );})}
              </nav>
              <section
                ref={drawerContentRef}
                className="truck-drawer-content"
                id={`drawer-panel-${activeDrawerSection.toLowerCase().replace(' ', '-')}`}
                role="tabpanel"
                aria-label={activeDrawerSection}
              >
                <div className="truck-drawer-content-heading">
                  <div>
                    <h3>{activeDrawerSection}</h3>
                    <p>
                      {activeDrawerSection === 'Base Info'
                        ? 'Container, package list, loading list, and SAP delivery.'
                        : activeDrawerSection === 'Cost'
                          ? 'Auto allocation and manual allocation for this truck.'
                          : activeDrawerSection === 'Carrier'
                            ? 'Carrier details and transportation log.'
                            : 'Departure, arrival, and proof of delivery.'}
                    </p>
                  </div>
                </div>
                {activeDrawerSection === 'Base Info' ? (
                  <BaseInfoEditor value={drawerDraft['Base Info']} onChange={updateBaseInfoDraft} />
                ) : activeDrawerSection === 'Cost' ? (
                  <CostEditor value={drawerDraft.Cost} onChange={updateCostDraft} />
                ) : activeDrawerSection === 'Carrier' ? (
                  <CarrierEditor value={drawerDraft.Carrier} onChange={updateCarrierDraft} />
                ) : (
                  <DeliveredEditor value={drawerDraft.Delivered} onChange={updateDeliveredDraft} />
                )}
              </section>
            </div>
            <footer className="truck-drawer-footer">
              <button className="drawer-delete" onClick={() => setDeletingRow(viewingRow)}>Delete Truck</button>
              <div className="drawer-footer-actions">
                {drawerSaveState === 'saved' && (
                  <span className="drawer-save-status" role="status">
                    <Icon name="check.svg" size={14} />
                    Saved
                  </span>
                )}
                <button onClick={requestCloseDrawer}>Cancel</button>
                <button className="drawer-save" disabled={!drawerDirty} onClick={saveDrawerChanges}>Save</button>
                <span className={`drawer-submit-wrap${sapDisabled ? ' is-disabled' : ''}`}>
                  {sapDisabled && (
                    <span className="drawer-submit-tooltip" id="sap-submit-hint" role="tooltip">
                      {sapHint}
                    </span>
                  )}
                  <button
                    type="button"
                    className="drawer-submit-sap"
                    disabled={sapDisabled}
                    aria-describedby={sapDisabled ? 'sap-submit-hint' : undefined}
                    onClick={() => {
                      if (!viewingRow) return;
                      persistDrawerChanges();
                      submitSap(viewingRow);
                    }}
                  >
                    Submit to SAP
                    {sapDisabled && (
                      <svg className="drawer-submit-hint-icon" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.25" />
                        <path d="M8 7.15v4.1" />
                        <circle cx="8" cy="5.15" r=".85" fill="currentColor" stroke="none" />
                      </svg>
                    )}
                  </button>
                </span>
              </div>
            </footer>
          </aside>
        </div>
      )}
      {pendingDrawerAction && viewingRow && (
        <div className="modal-backdrop unsaved-modal-backdrop" role="presentation" onMouseDown={() => setPendingDrawerAction(null)}>
          <section className="confirm-modal unsaved-confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="unsaved-title" aria-describedby="unsaved-description" onMouseDown={(event) => event.stopPropagation()}>
            <h2 id="unsaved-title">Unsaved changes</h2>
            <p id="unsaved-description">
              You changed <strong>{dirtyDrawerSections.join(', ')}</strong>. Save these changes before leaving this truck?
            </p>
            <div className="confirm-actions unsaved-confirm-actions">
              <button onClick={() => setPendingDrawerAction(null)}>Keep Editing</button>
              <button className="discard" onClick={() => continuePendingDrawerAction(false)}>Discard Changes</button>
              <button className="primary" onClick={() => continuePendingDrawerAction(true)}>Save &amp; Continue</button>
            </div>
          </section>
        </div>
      )}
      {deletingRow && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setDeletingRow(null)}>
          <section className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" onMouseDown={(event) => event.stopPropagation()}>
            <h2 id="delete-title">Delete truck record?</h2>
            <p>
              Carrier reference {deletingRow.carrierRef} will be permanently deleted.
              {drawerDirty && viewingRow?.id === deletingRow.id && <> Unsaved changes in <strong>{dirtyDrawerSections.join(', ')}</strong> will also be discarded.</>}
            </p>
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
