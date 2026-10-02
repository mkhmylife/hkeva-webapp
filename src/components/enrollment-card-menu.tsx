'use client';

import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {EllipsisVertical} from "lucide-react";
import {Link} from "@/i18n/navigation";

type Props = {
  label: string;
  items: {
    href: string;
    label: string;
  }[];
}

export default function EnrollmentCardMenu(props: Props) {

  return (
    <Menu>
      <MenuButton
        aria-label={props.label}
        className="-mr-1.5 size-8 shrink-0 flex items-center justify-center rounded-full cursor-pointer text-brand-neutral-500 hover:bg-brand-neutral-200 data-open:bg-brand-neutral-200 focus:outline-none data-focus:bg-brand-neutral-200"
      >
        <EllipsisVertical className="size-5"/>
      </MenuButton>
      <MenuItems
        anchor={{to: "bottom end", gap: 4}}
        className="z-20 min-w-36 rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
      >
        {props.items.map((item) => (
          <MenuItem key={item.href}>
            <Link href={item.href} className="block rounded-lg px-3 py-2 font-medium data-focus:bg-primary-100">
              {item.label}
            </Link>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );

}
