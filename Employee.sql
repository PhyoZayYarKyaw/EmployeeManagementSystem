PGDMP      %                |            Employee    16.3    16.3     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16724    Employee    DATABASE     �   CREATE DATABASE "Employee" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "Employee";
                postgres    false            �            1259    16734    Management_employee    TABLE     �  CREATE TABLE public."Management_employee" (
    "EmployeeID" character varying(50) NOT NULL,
    photo character varying(100) NOT NULL,
    name character varying(100) NOT NULL,
    "DOB" date NOT NULL,
    "Gender" character varying(6) NOT NULL,
    "NRC" character varying(50) NOT NULL,
    "Email" character varying(254) NOT NULL,
    "Address" text NOT NULL,
    "Skills" character varying(100),
    "Department" character varying(20) NOT NULL
);
 )   DROP TABLE public."Management_employee";
       public         heap    postgres    false            �          0    16734    Management_employee 
   TABLE DATA           �   COPY public."Management_employee" ("EmployeeID", photo, name, "DOB", "Gender", "NRC", "Email", "Address", "Skills", "Department") FROM stdin;
    public          postgres    false    217    
       L           2606    16888 >   Management_employee Management_employee_EmployeeID_5d0b1adf_pk 
   CONSTRAINT     �   ALTER TABLE ONLY public."Management_employee"
    ADD CONSTRAINT "Management_employee_EmployeeID_5d0b1adf_pk" PRIMARY KEY ("EmployeeID");
 l   ALTER TABLE ONLY public."Management_employee" DROP CONSTRAINT "Management_employee_EmployeeID_5d0b1adf_pk";
       public            postgres    false    217            J           1259    16889 ,   Management_employee_EmployeeID_5d0b1adf_like    INDEX     �   CREATE INDEX "Management_employee_EmployeeID_5d0b1adf_like" ON public."Management_employee" USING btree ("EmployeeID" varchar_pattern_ops);
 B   DROP INDEX public."Management_employee_EmployeeID_5d0b1adf_like";
       public            postgres    false    217            �   �  x��X[S�L|��"��V�ffr}��
b0
+��U�Y�$B.B�_�3�`�`uW��I5�眞����,Dn��C��gq���=
��D��>��� %	�Ȃ�`�#�&��>���"YQ5aJ� �����؛<�>�=Y�T���apr�wڒQ�8W�,�c[�����;?�Z/-7	*�[�֒ �J@��aD6�p�B^�%μ k��3_��m��$��%���a�9��'�)  �u��W�K�p�0�/H��D������1��?�\a�Ea��D��q�L\���Z��H�
�qH1��7��a��%)��K�Gb�D��J�o�њ���I�_��,әV�(���x�s� Y�����sC�p���'l^�� {b'�������4��t[�H؛�����M�y�Jp�H?�oT�{�iXw����P+ �0�]�O�|%�S"A����/�?�D��Ƭ��K�
}$T���#N Qu7��<�uv
��69j����ÂV�(��[gJZ���v���4�����}�u/b-����ﶧ�%��TS�!�4�B�_��d����Q��a��x�P�Fƕ=��/1T9�ߏ^�;�ݜ�� �[ m:A���99�c���%*���Ĺ�s�o��]g�����uO�V�竫J\�A׸~����Ȩ��黍Ib�P����h���*.e������ ە;w`��+>t�����b�mkC!V]R�+t?�_*�-Cʿ+�����I�Y,��x�4�*�S��
_F�s��(K$��v�:���&9��yS(�/�.#0B�Pokxy�z�V�D/���H�8x��;���ةe=t�>���c�����q�����Mc^fI�2�ѹ��́��&МG�/S���r�/=�=��2y�ɖbn�wm@� ��#�8�$������;�_�*72�,a:n��=-q�`7)J���s'C������Xh!<<SF�&���jMN�sg��:s�u�6,G7��Ŭ]LIS���*ҿ�Qa�"�C�$[�	�5'|�m����s��@*�$��5���Xk̭*qg��ը��]�Z���HT��"4�h��N� ji�����+�Rg��1�S<-�0�Z�T�<��9ʭ�K��f���v�ğj�@o�M����٨�+h��� +��k͑f���ο�x>]>&M���k��$*���֯�s�A�w��<�������     