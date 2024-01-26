import { useCallback, useMemo, useState } from "react";
import classes from "./DictionariesContainer.module.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Table from "../../components/common/Table/Table";
import { Company } from "../../types/Company";
import { Contract } from "../../types/Contract";
import { DictionariesModal } from "./DictionaryModal/DictionaryModal";
import Button from "../../components/common/Button/Button";
import { useDictionaries } from "../../providers/DictionaryProvider";
import InfoBox from "../../components/common/InfoBox/InfoBox";

type DictionaryFields = "NAME";
export type DictionaryActions = "edit" | "delete";
export type DictionaryTable = "company" | "contract";
export type DictionaryType = Company | Contract;

const DICTIONARY_FIELDS: Record<DictionaryFields, string> = {
  NAME: "name",
} as const;

export const DictionariesContainer = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<DictionaryActions>("edit");

  const [selectedItem, setSelectedItem] = useState<DictionaryType>();
  const [selectedTable, setSelectedTable] =
    useState<DictionaryTable>("company");

  const {
    isFetching,
    companies,
    contracts,
    addUpdateCompany,
    addUpdateContract,
    deleteCompany,
    deleteContract,
  } = useDictionaries();

  const handleDictionaryElementUpdate: Record<
    DictionaryTable,
    (element: DictionaryType) => Promise<DictionaryType> | undefined
  > = useMemo(() => {
    return {
      company: addUpdateCompany,
      contract: addUpdateContract,
    };
  }, [selectedItem]);

  const handleDictionaryElementDelete: Record<
    DictionaryTable,
    (id: number) => Promise<boolean> | undefined
  > = useMemo(() => {
    return {
      company: deleteCompany,
      contract: deleteContract,
    };
  }, [selectedItem]);

  const handleShowModal = () => setShowModal((showModal) => !showModal);

  const handleSaveEditModal = useCallback(
    async (editModalValue: string) => {
      if (editModalValue) {
        const updObj: DictionaryType = {
          id: selectedItem?.id,
          name: editModalValue,
        };

        handleDictionaryElementUpdate[selectedTable as DictionaryTable](updObj);
      }
    },
    [selectedItem, selectedTable, modalContent, showModal]
  );

  const handleSaveDeleteModal = useCallback(() => {
    if (selectedItem && selectedItem.id) {
      handleDictionaryElementDelete[selectedTable as DictionaryTable](
        selectedItem.id
      );
    }
  }, [selectedItem, selectedTable, modalContent, showModal]);

  const handleEditAction = useCallback(
    ([table, value]: [DictionaryTable, DictionaryType]) => {
      setSelectedItem(value);
      setSelectedTable(table);
      modalContent !== "edit" && setModalContent("edit");
      handleShowModal();
    },
    [selectedItem, selectedTable, modalContent, showModal]
  );

  const handleDeleteAction = useCallback(
    ([table, value]: [DictionaryTable, DictionaryType]) => {
      setSelectedItem(value);
      setSelectedTable(table);
      console.log(table);
      modalContent !== "delete" && setModalContent("delete");
      handleShowModal();
    },
    [selectedItem, selectedTable, modalContent, showModal]
  );

  const handleAddNewAction = useCallback(
    (table: DictionaryTable) => {
      setSelectedTable(table);
      setSelectedItem(undefined);
      setModalContent("edit");
      handleShowModal();
    },
    [selectedItem, selectedTable, modalContent, showModal]
  );

  const DICTIONARY_ACTIONS: Record<
    DictionaryActions,
    (el: [DictionaryTable, DictionaryType]) => void
  > = useMemo(
    () => ({
      edit: handleEditAction,
      delete: handleDeleteAction,
    }),
    [selectedItem, selectedTable, modalContent]
  );

  return (
    <div className={classes.dicitonariesContainer}>
      <h2>Definitions management</h2>
      <Tabs>
        <TabList>
          <Tab>Company</Tab>
          <Tab>Contract</Tab>
        </TabList>

        <TabPanel>
          <InfoBox variant="info">
            Here you will find definitions of the companies you can manage.
            <br />
            To create a new company definition click on the button 'Add New'.
          </InfoBox>
          <Button
            variant="secondary"
            onClick={() => handleAddNewAction("company")}
          >
            Add New
          </Button>
          <Table
            data={companies}
            fields={[DICTIONARY_FIELDS.NAME]}
            actions={DICTIONARY_ACTIONS}
            id="company"
          />
        </TabPanel>
        <TabPanel>
          <InfoBox variant="info">
            Here you will find definitions of the contracts you can manage.
            <br /> To create a new contract definition click on the button 'Add
            New'.
          </InfoBox>

          <Button
            variant="secondary"
            onClick={() => handleAddNewAction("contract")}
          >
            Add New
          </Button>
          <Table
            data={contracts}
            fields={[DICTIONARY_FIELDS.NAME]}
            actions={DICTIONARY_ACTIONS}
            id="contract"
          />
        </TabPanel>
      </Tabs>
      <DictionariesModal
        isFetching={isFetching}
        action={modalContent}
        isShowing={showModal}
        selectedItem={selectedItem}
        selectedTable={selectedTable}
        onClose={handleShowModal}
        onEdit={handleSaveEditModal}
        onDelete={handleSaveDeleteModal}
      />
    </div>
  );
};
