import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItemType[] }) {
    const { t } = useTranslation();
    return (
        <>
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList className="text-[#646678] dark:text-[#d4d0e6]">
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            const translatedTitle = t(item.title, { defaultValue: item.title });
                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage className="font-semibold text-[#17182A] dark:text-[#ffffff]">
                                                {translatedTitle}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild className="font-medium text-[#646678] hover:text-[#5E4BF2] dark:text-[#c4b5fd] dark:hover:text-[#ffffff]">
                                                <Link href={item.href}>{translatedTitle}</Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator className="text-[#92909D] dark:text-[#a78bfa]" />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </>
    );
}
